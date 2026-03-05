// ==UserScript==
// @name         12_Test_Header
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Erstellt Test-Buttons im Header
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // --- Eigene Fenster-Funktion (Unabhängig vom Spiel) ---
    window.PG_toggleCustomWindow = function(title, rowsContent) {
        // 1. Prüfen, ob Fenster schon da ist -> wenn ja, schließen (toggle)
        const existingWindow = document.getElementById('pg-custom-window');
        if (existingWindow) {
            existingWindow.remove();
            return;
        }

        // 2. Fenster-Container erstellen
        const win = document.createElement('div');
        win.id = 'pg-custom-window';
        // Inline-Styles für komplette Unabhängigkeit
        win.style.position = 'fixed';
        win.style.top = '19%';
        win.style.left = '20%';
        // win.style.transform = 'translate(-50%, -50%)'; // Entfernt, damit top/left die obere linke Ecke bestimmen
        win.style.backgroundColor = 'rgb(30, 41, 59)'; // Dunkles Blau-Grau
        win.style.color = 'rgb(241, 245, 249)'; // Helles Weiß-Grau
        win.style.borderRadius = '8px';
        win.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)'; // Kräftiger Schatten
        win.style.zIndex = '10000'; // Ganz oben
        win.style.minWidth = '680px';
        win.style.border = '2px solid rgb(71, 85, 105)';
        win.style.fontFamily = 'sans-serif';
        // Layout für den scrollbaren Inhaltsbereich vorbereiten
        win.style.display = 'flex';
        win.style.flexDirection = 'column';
        win.style.maxHeight = '80vh'; // Maximale Höhe des Fensters
        win.style.padding = '20px';

        // 3. Schließen-Button (X) oben rechts
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'rgb(148, 163, 184)';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';
        closeBtn.onclick = () => win.remove();
        win.appendChild(closeBtn);

        // 4. Titel
        const h3 = document.createElement('h3');
        h3.textContent = title;
        h3.style.marginTop = '0';
        h3.style.marginBottom = '15px';
        h3.style.borderBottom = '1px solid rgb(51, 65, 85)';
        h3.style.paddingBottom = '10px';
        win.appendChild(h3);

        // 5. Container für den Inhalt, damit dieser scrollbar wird, der Header aber nicht
        const contentContainer = document.createElement('div');
        contentContainer.id = 'pg-custom-window-content';
        contentContainer.style.overflowY = 'auto'; // Nur vertikal scrollen
        contentContainer.style.paddingRight = '10px'; // Platz für Scrollbar, vermeidet "springen"
        contentContainer.style.marginRight = '-10px'; // gleicht paddingRight aus

        // 6. Inhalt (Reihen) generieren und in den Content-Container einfügen
        rowsContent.forEach(content => {
            const row = document.createElement('div');
            row.style.marginBottom = '10px';
            row.style.padding = '12px';
            row.style.backgroundColor = 'rgb(15, 23, 42)'; // Noch dunklerer Hintergrund für die Zeilen
            row.style.borderRadius = '6px';
            row.style.border = '1px solid rgb(51, 65, 85)';
            row.textContent = content;
            contentContainer.appendChild(row);
        });
        win.appendChild(contentContainer);
        document.body.appendChild(win);
    };

    function createNativeHeaderButton(id, iconUrl, tooltip, onClick) {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex shrink-0 items-center gap-4 not-first:pl-4';
        wrapper.setAttribute('data-pg-button-wrapper', id); // Eindeutiger Marker für unsere Wrapper

        const imageContainer = document.createElement('div');
        imageContainer.className = 'relative';

        const icon = document.createElement('img');
        icon.id = id;
        icon.src = iconUrl;
        // Integration mit dem Custom-Tooltip-System aus 01_header.user.js
        icon.setAttribute('data-tooltip', tooltip);
        icon.className = 'img image-shadow size-16 object-contain transition-transform duration-150';
        icon.style.cursor = 'pointer';

        // Fügt die Klick-Aktion hinzu, falls eine in der Konfiguration definiert wurde
        if (onClick) {
            icon.addEventListener('click', onClick);
        }

        icon.onmouseover = () => icon.style.transform = 'scale(1.1)';
        icon.onmouseout = () => icon.style.transform = 'scale(1)';

        const separator = document.createElement('div');
        separator.className = 'my-4 h-4/5 border-r-4';

        imageContainer.appendChild(icon);
        wrapper.appendChild(imageContainer);
        wrapper.appendChild(separator);

        return wrapper;
    }
    
    function addButtons(container) {
        // Füge nur dann einen Trenner zum letzten nativen Button hinzu, wenn nötig.
        const lastButtonWrapper = container.lastElementChild;
        if (lastButtonWrapper && !lastButtonWrapper.hasAttribute('data-pg-button-wrapper') && !lastButtonWrapper.querySelector('.border-r-4')) {
            const separator = document.createElement('div');
            separator.className = 'my-4 h-4/5 border-r-4';
            lastButtonWrapper.appendChild(separator);
        }

        // Füge unsere Buttons hinzu, falls sie fehlen.
        window.PG_TEST_CONFIG.nativeHeaderButtons.forEach(btn => {
            if (!document.getElementById(btn.id)) {
                const newBtnElement = createNativeHeaderButton(btn.id, btn.icon, btn.tooltip, btn.onClick);
                container.appendChild(newBtnElement);
            }
        });
    }

    function initButtonObserver() {
        const containerSelector = '[data-tutorial-id="navigation-right-section"]';

        // Wir nutzen die waitForElement-Funktion aus 01_header.user.js, um auf den Container zu warten.
        if (typeof window.waitForElement !== 'function' || !window.PG_TEST_CONFIG?.nativeHeaderButtons) {
            console.error("P&G Skript: 01_header.user.js oder PG_TEST_CONFIG.nativeHeaderButtons nicht gefunden.");
            return;
        }

        window.waitForElement(containerSelector, (targetContainer) => {
            // 1. Buttons initial erstellen
            addButtons(targetContainer);

            // 2. Den Container auf Änderungen beobachten (falls das Spiel unsere Buttons entfernt)
            const observer = new MutationObserver((mutations) => {
                let needsRecheck = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                        // Prüfen, ob einer unserer Buttons entfernt wurde
                        for (const removedNode of mutation.removedNodes) {
                            if (removedNode.nodeType === Node.ELEMENT_NODE && removedNode.hasAttribute('data-pg-button-wrapper')) {
                                needsRecheck = true;
                                break;
                            }
                        }
                    }
                }
                if (needsRecheck) {
                    // Wenn ja, unsere add-Logik erneut ausführen.
                    addButtons(targetContainer);
                }
            });

            observer.observe(targetContainer, { childList: true });
        });
    }

    // Wir warten, bis die Hilfsfunktionen aus den anderen Skripten geladen sind.
    const checkDependencies = setInterval(() => {
        // Warte auf die Bibliothek (01_header) und die Konfiguration (11_test_config)
        if (window.waitForElement && window.PG_TEST_CONFIG) {
            clearInterval(checkDependencies);
            initButtonObserver();
        }
    }, 100);

})();