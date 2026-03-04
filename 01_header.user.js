// ==UserScript==
// @name         00_PGLibrary
// @namespace    PeterGemi
// @version      2.5.0
// @description  Zentrale Funktions-Bibliothek für alle P&G Skripte. Muss vor allen anderen P&G Skripten laufen.
// @author       Peter&Gemi
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

    window.applyBuildingFilter = function(filterName) {
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

    // Erstellt einen einzelnen Button in der Header-Leiste.
    window.createHeaderButton = function(id, icon, onClick, tooltipText, text) {
        let topRight = document.querySelector('#headerBar .flex.flex-nowrap.items-center > div.gap-md.flex')
                      || document.querySelector('#headerBar > div > div:last-child');

        if (!topRight || document.querySelector("#" + id)) return;

        const btn = document.createElement("button");
        btn.id = id;
        // WICHTIG: Die Klassen des Spiels + deine eigene für das CSS
        btn.className = "bb-base-button variant--neutral size--md theme--light pb-header-btn";
        btn.style.display = "inline-flex"; 
        btn.style.flexDirection = "column";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.height = "45px";
        btn.style.minWidth = "45px";
        btn.style.padding = "4px 2px";
        
        // TOOLTIP AKTIVIEREN (Das Attribut, das das Spiel ausliest)
        if (tooltipText) {
            btn.setAttribute("data-tooltip", tooltipText);
        }

        const img = document.createElement("img");
        img.src = icon;
        img.className = "pb-header-icon"; // Deine CSS-Klasse
        img.draggable = false;
        img.style.pointerEvents = "none";

        btn.appendChild(img);

         if (onClick) btn.addEventListener("click", onClick);
        topRight.appendChild(btn);

        if (window.sortHeaderButtons) window.sortHeaderButtons();
    };

    // Initialisiert alle Header-Buttons und sorgt dafür, dass sie dauerhaft sichtbar bleiben.
    window.initHeaderButtons = function(buttons) {
        window.headerButtonOrder = buttons.map(b => b.id);
        setInterval(() => {
            buttons.forEach(btn => {
                window.createHeaderButton(btn.id, btn.icon, btn.onClick, btn.tooltip, btn.text);
            });
        }, 1000);
    };

    // Sortiert die Header-Buttons in der vordefinierten Reihenfolge.
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
    // 3. NAV-LINKS LOGIK (Haupt-Toggle Button)
    // =============================================================

    window.createNavLeftButton = function(id, icon, onClick, tooltipText) {
        const navLeftContainer = document.querySelector('[data-tutorial-id="navigation-left-section"]');

        if (!navLeftContainer || document.getElementById(id)) return;

        const btn = document.createElement("button");
        btn.id = id;
        // Basale Klassen und Styles, damit es nicht komplett deplatziert wirkt
        btn.className = "bb-base-button variant--neutral theme--light";
        btn.style.display = "inline-flex";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.width = "45px";
        btn.style.height = "45px";
        btn.style.padding = "0";
        btn.style.marginRight = "16px"; // Etwas Abstand

        if (tooltipText) {
            btn.setAttribute("data-tooltip", tooltipText);
        }

        const img = document.createElement("img");
        img.src = icon;
        img.style.width = "45px";
        img.style.height = "45px";
        img.draggable = false;
        img.style.pointerEvents = "none";

        btn.appendChild(img);
        if (onClick) btn.addEventListener("click", onClick);

        navLeftContainer.prepend(btn);
    };

    // =============================================================
    // 4. SUCH-DIV LOGIK (Die Untermenüs / Produktions-Buttons)
    // =============================================================

    window.activeSearchButtonLoops = [];

    window.clearSearchDivButtons = function() {
        // Stoppt alle aktiven Intervalle, die versuchen, Buttons zu zeichnen.
        if (window.activeSearchButtonLoops) {
            window.activeSearchButtonLoops.forEach(stop => stop());
            window.activeSearchButtonLoops = [];
        }
        const searchInput = document.querySelector('input[placeholder="Suche"]');
        if (!searchInput) return;
        const container = searchInput.parentElement.parentElement;
        container.querySelectorAll("button").forEach(btn => {
            // Löscht nur unsere eigenen Buttons (erkennbar an der ID)
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
            const input = document.querySelector('input[placeholder="Suche"]');
            if (!input) return;
            const container = input.parentElement.parentElement;

            if (!container.querySelector("#" + id)) {
                const btn = document.createElement("button");
                btn.id = id;
                btn.type = "button";
                // Die Klassen 'shape--square' und 'content--icon' entfernt, um eigenes Layout zu ermöglichen
                btn.className = "bb-base-button variant--neutral size--md theme--light ml-auto pb-search-btn";

                // Style-Anpassungen für Icon + Text, analog zu den Header-Buttons
                btn.style.display = "inline-flex";
                btn.style.flexDirection = "column";
                btn.style.justifyContent = "center";
                btn.style.alignItems = "center";
                btn.style.height = "45";
                btn.style.minWidth = "45px";
                btn.style.padding = "4px 2px";
                
                if (tooltipText) {
                    btn.setAttribute("data-tooltip", tooltipText);
                }

                const img = document.createElement("img");
                img.src = icon;
                img.className = "pb-search-icon";
                img.draggable = false;
                img.style.pointerEvents = "none";

                btn.appendChild(img);

                if (onClick) btn.addEventListener("click", onClick);
                container.appendChild(btn);
            }
        };
        intervalId = setInterval(checkAndInsert, 500);
        checkAndInsert();
    };

    // =============================================================
    // 5. EIGENES TOOLTIP-SYSTEM
    // =============================================================

    // Da das Spiel unsere dynamischen Buttons ignoriert, erstellen wir unser eigenes Tooltip-System.
    // Dieses System ist 100% unabhängig und funktioniert immer.
    (function() {
        const tooltipElement = document.createElement('div');
        tooltipElement.id = 'pg-custom-tooltip'; // pg für Peter&Gemi ;)
        tooltipElement.style.position = 'fixed';
        tooltipElement.style.zIndex = '99999';
        tooltipElement.style.background = 'rgba(20, 20, 20, 0.9)';
        tooltipElement.style.color = 'white';
        tooltipElement.style.padding = '5px 10px';
        tooltipElement.style.borderRadius = '4px';
        tooltipElement.style.display = 'none';
        tooltipElement.style.pointerEvents = 'none'; // Der Tooltip selbst ist für die Maus unsichtbar.
        tooltipElement.style.fontSize = '13px';
        document.body.appendChild(tooltipElement);

        document.body.addEventListener('mouseover', function(e) {
            const target = e.target.closest('[data-tooltip]');
            if (target && target.getAttribute('data-tooltip')) {
                tooltipElement.textContent = target.getAttribute('data-tooltip');
                tooltipElement.style.display = 'block';
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('[data-tooltip]')) tooltipElement.style.display = 'none';
        });

        document.body.addEventListener('mousemove', (e) => {
            if (tooltipElement.style.display === 'block') {
                tooltipElement.style.left = (e.clientX + 12) + 'px';
                tooltipElement.style.top = (e.clientY + 12) + 'px';
            }
        });
    })();

})();