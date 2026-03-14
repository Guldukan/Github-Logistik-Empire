// ==UserScript==
// @name         01_header
// @namespace    Header
// @version      2.0.0
// @description  Zentrale Funktions-Bibliothek für alle P&G Skripte. Muss vor allen anderen P&G Skripten laufen.
// @author       PB@G Flöha-Logistik
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================
    // 1. HILFSFUNKTIONEN (Suche & Observer)
    // =============================================================

    window.waitForElement = function(selector, callback) {
        function check() {
            const el = document.querySelector(selector);
            if (el) { callback(el); observer.disconnect(); }
        }
        const observer = new MutationObserver(check);
        observer.observe(document.body, { childList: true, subtree: true });
        check();
    };

    window.applyBuildingFilter = function(filterName, buttonId) {
        document.querySelectorAll('.pb-search-btn').forEach(b => { b.style.backgroundColor = ''; });
        const clickedButton = document.getElementById(buttonId);
        if (clickedButton) { clickedButton.style.backgroundColor = '#FFB6C1'; }

        const searchInput = document.querySelector('input[placeholder="Suche"]');
        if (searchInput) {
            searchInput.focus();
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            if (setter) setter.call(searchInput, filterName);
            else searchInput.value = filterName;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // =============================================================
    // 2. HEADER-LEISTE LOGIK
    // =============================================================

    window.createHeaderButton = function(id, icon, onClick, tooltipText) {
        let topRight = document.querySelector('#headerBar .flex.flex-nowrap.items-center > div.gap-md.flex')
                      || document.querySelector('#headerBar > div > div:last-child');
        if (!topRight || document.querySelector("#" + id)) return;

        const btn = document.createElement("button");
        btn.id = id;
        btn.className = "bb-base-button variant--neutral size--md theme--light pb-header-btn";
        btn.style.cssText = "display: inline-flex; flex-direction: column; justify-content: center; align-items: center; height: 45px; min-width: 45px; padding: 4px 2px;";
        
        if (tooltipText) btn.setAttribute("data-tooltip", tooltipText);

        const img = document.createElement("img");
        img.src = icon;
        img.style.pointerEvents = "none";
        img.style.width = "24px"; // Standardgröße für Header-Icons

        btn.appendChild(img);
        if (onClick) btn.addEventListener("click", onClick);
        topRight.appendChild(btn);

        if (window.sortHeaderButtons) window.sortHeaderButtons();
    };

    window.initHeaderButtons = function(buttons) {
        window.headerButtonOrder = buttons.map(b => b.id);
        setInterval(() => {
            buttons.forEach(btn => {
                window.createHeaderButton(btn.id, btn.icon, btn.onClick, btn.tooltip);
            });
        }, 1000);
    };

    window.sortHeaderButtons = function() {
        let topRight = document.querySelector('#headerBar .flex.flex-nowrap.items-center > div.gap-md.flex')
                      || document.querySelector('#headerBar > div > div:last-child');
        if (!topRight || !window.headerButtonOrder) return;
        window.headerButtonOrder.forEach(id => {
            const el = document.querySelector("#" + id);
            if (el) topRight.appendChild(el);
        });
    };

    // =============================================================
    // 4. SUCH-DIV LOGIK (Untermenüs)
    // =============================================================

    window.activeSearchButtonLoops = [];

    window.clearSearchDivButtons = function() {
        if (window.activeSearchButtonLoops) {
            window.activeSearchButtonLoops.forEach(stop => stop());
            window.activeSearchButtonLoops = [];
        }
        const searchInput = document.querySelector('input[placeholder="Suche"]');
        if (!searchInput) return;
        const container = searchInput.parentElement.parentElement;
        container.querySelectorAll("button").forEach(btn => {
            if (btn.id && (btn.id.startsWith("btn") || btn.id.startsWith("sub")) && !btn.hasAttribute("data-tutorial-id")) {
                btn.remove();
            }
        });
    };

    window.insertButtonInSearchDiv = function(id, icon, onClick, tooltipText) {
        let intervalId = null;
        const stop = () => { if (intervalId) clearInterval(intervalId); };
        window.activeSearchButtonLoops.push(stop);

        const checkAndInsert = () => {
            const input = document.querySelector('#headerBar input[placeholder="Suche"]');
            if (!input) return;
            const container = input.parentElement.parentElement;

            if (!container.querySelector("#" + id)) {
                const btn = document.createElement("button");
                btn.id = id;
                btn.type = "button";
                btn.className = "bb-base-button variant--neutral size--md theme--light ml-auto pb-search-btn";
                btn.style.cssText = "display: inline-flex; flex-direction: column; justify-content: center; align-items: center; height: 45px; min-width: 45px; padding: 4px 2px;";
                
                if (tooltipText) btn.setAttribute("data-tooltip", tooltipText);

                const img = document.createElement("img");
                img.src = icon;
                img.style.pointerEvents = "none";
                img.style.width = "24px";

                btn.appendChild(img);
                if (onClick) btn.addEventListener("click", onClick);
                container.appendChild(btn);
            }
        };
        intervalId = setInterval(checkAndInsert, 500);
        checkAndInsert();
    };

    // =============================================================
    // 5. TOOLTIP-SYSTEM
    // =============================================================

    (function() {
        const tooltip = document.createElement('div');
        tooltip.style.cssText = 'position:fixed; z-index:999999; background:rgba(20,20,20,0.9); color:white; padding:5px 10px; border-radius:4px; display:none; pointer-events:none; font-size:13px;';
        document.body.appendChild(tooltip);

        document.body.addEventListener('mouseover', e => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                tooltip.textContent = target.getAttribute('data-tooltip');
                tooltip.style.display = 'block';
            }
        });
        document.body.addEventListener('mouseout', () => tooltip.style.display = 'none');
        document.body.addEventListener('mousemove', e => {
            if (tooltip.style.display === 'block') {
                tooltip.style.left = (e.clientX + 12) + 'px';
                tooltip.style.top = (e.clientY + 12) + 'px';
            }
        });
    })();

// =============================================================
// 6. GEBÄUDE-FILTER PANEL (Das Overlay)
// =============================================================

// --- Globale Variablen für die Hiding-Logik ---
window.pgActiveFilterConfigs = new Map();
window.pgHidingObserver = null;

// --- Observer-Callback: Wird aufgerufen, wenn der DOM sich ändert ---
function pgHidingObserverCallback(mutationsList) {
    // Wenn keine Filter aktiv sind, nichts tun.
    if (window.pgActiveFilterConfigs.size === 0) return;

    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return; // Nur Element-Nodes

                // Funktion, um einen einzelnen Marker zu prüfen und ggf. zu verstecken
                const checkAndHide = (markerNode) => {
                    for (const config of window.pgActiveFilterConfigs.values()) {
                        const selector = config.selector || `:scope:has(img[src*="${config.icon_part}"])`;
                        if (markerNode.matches(selector)) {
                            // Verstecke den Marker direkt. Dies fängt Fälle ab,
                            // die die CSS-Regel beim Zoomen nicht erwischt.
                            markerNode.style.display = 'none';
                            return; // Einmal versteckt, brauchen wir nicht weiter prüfen
                        }
                    }
                };

                // Prüfe, ob der hinzugefügte Node selbst ein Marker ist
                if (node.matches('.maplibregl-marker')) {
                    checkAndHide(node);
                }
                // Prüfe, ob der Node Marker als Kinder enthält
                else if (node.querySelectorAll) {
                    node.querySelectorAll('.maplibregl-marker').forEach(checkAndHide);
                }
            });
        }
    }
}

// --- Start/Stop Funktionen für den Observer ---
function pgEnsureObserverIsRunning() {
    if (window.pgHidingObserver) return; // Läuft schon
    const targetNode = document.body;
    const observerConfig = { childList: true, subtree: true };
    window.pgHidingObserver = new MutationObserver(pgHidingObserverCallback);
    window.pgHidingObserver.observe(targetNode, observerConfig);
    console.log("P&G: Hiding Observer gestartet.");
}

function pgStopObserverIfUnused() {
    if (window.pgHidingObserver && window.pgActiveFilterConfigs.size === 0) {
        window.pgHidingObserver.disconnect();
        window.pgHidingObserver = null;
        console.log("P&G: Hiding Observer gestoppt.");
    }
}


window.toggleBuildingFilterPanel = function(filterGroup, buildings) {
    const panelId = 'pg-filter-panel';
    const listContainerId = 'filter-list-container';
    let panel = document.getElementById(panelId);

    // Panel erstellen, falls es nicht existiert
    if (!panel) {
        panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 320px; max-height: 80vh; background: #1a1a1a; border: 2px solid #FFB6C1;
            border-radius: 12px; color: white; z-index: 1000000; padding: 20px;
            display: flex; flex-direction: column; box-shadow: 0 0 30px rgba(0,0,0,1);
            font-family: Arial, sans-serif;
        `;
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #444; margin-bottom: 15px; padding-bottom: 10px;">
                <span id="pg-panel-title" style="font-weight: bold; color: #FFB6C1; font-size: 18px;">Karten-Filter</span>
                <button id="close-pg-panel" style="background: #444; border: none; color: white; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">✕</button>
            </div>
            <div id="${listContainerId}" style="overflow-y: auto; flex-grow: 1;"></div>
        `;
        document.body.appendChild(panel);
        document.getElementById('close-pg-panel').onclick = () => panel.style.display = 'none';
    }

    // Liste immer leeren und neu befüllen
    const list = document.getElementById(listContainerId);
    list.innerHTML = '';

    // Titel aktualisieren
    const titleEl = document.getElementById('pg-panel-title');
    if (titleEl) {
        const groupName = filterGroup.charAt(0).toUpperCase() + filterGroup.slice(1);
        titleEl.textContent = `Filter: ${groupName}`;
    }

    buildings.forEach(b => {
        const safeName = b.name.replace(/\s+/g, '-').toLowerCase();
        const isHidden = window.pgActiveFilterConfigs.has(safeName);
        const row = document.createElement('div');
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 10px; background: #2a2a2a; border-radius: 8px;";
        row.innerHTML = `
            <span>${b.name}</span>
            <button id="btn-toggle-${safeName}" style="background: ${isHidden ? '#ff4d4d' : '#4CAF50'}; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; min-width: 70px;">
                ${isHidden ? 'OFF' : 'ON'}
            </button>
        `;
        row.querySelector('button').onclick = () => window.executeToggle(b); // Das ganze Objekt übergeben
        list.appendChild(row);
    });

    // Panel anzeigen und aktuelle Gruppe speichern
    panel.style.display = 'flex';
    panel.dataset.currentGroup = filterGroup;
};

window.executeToggle = function(buildingConfig) {
    const safeName = buildingConfig.name.replace(/\s+/g, '-').toLowerCase();
    const styleId = 'style-hide-' + safeName;
    const btn = document.getElementById('btn-toggle-' + safeName);
    const isTurningOn = !window.pgActiveFilterConfigs.has(safeName);

    if (isTurningOn) {
        // --- FILTER EINSCHALTEN ---
        window.pgActiveFilterConfigs.set(safeName, buildingConfig);

        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        const selector = buildingConfig.selector || `.maplibregl-marker:has(img[src*="${buildingConfig.icon_part}"])`;
        styleEl.innerHTML = `
            ${selector} {
                display: none !important;
            }
        `;
        document.head.appendChild(styleEl);

        if(btn) { btn.style.backgroundColor = '#ff4d4d'; btn.innerText = 'OFF'; }

        // Starte den Observer, um dynamische Änderungen (zoomen) abzufangen
        pgEnsureObserverIsRunning();

    } else {
        // --- FILTER AUSSCHALTEN ---
        window.pgActiveFilterConfigs.delete(safeName);

        const styleEl = document.getElementById(styleId);
        if (styleEl) styleEl.remove();

        if(btn) { btn.style.backgroundColor = '#4CAF50'; btn.innerText = 'ON'; }

        // Bereinige Marker, die vom Observer per Inline-Style versteckt wurden
        const selector = buildingConfig.selector || `.maplibregl-marker:has(img[src*="${buildingConfig.icon_part}"])`;
        document.querySelectorAll(selector).forEach(marker => {
            if (marker.style.display === 'none') {
                marker.style.display = ''; // Setzt den Style zurück
            }
        });

        // Stoppe den Observer, wenn er nicht mehr gebraucht wird
        pgStopObserverIfUnused();
    }
};

})();