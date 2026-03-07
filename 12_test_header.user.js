// ==UserScript==
// @name         12_Test_Header
// @namespace    http://tampermonkey.net/
// @version      1.4
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

        // 3. Schließen-Button (X) oben rechts
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.className = 'pg-custom-window-close';
        closeBtn.onclick = () => win.remove();
        win.appendChild(closeBtn);

        // 4. Titel
        const h3 = document.createElement('h3');
        h3.textContent = title;
        win.appendChild(h3);

        // 5. Container für den Inhalt, damit dieser scrollbar wird, der Header aber nicht
        const contentContainer = document.createElement('div');
        contentContainer.id = 'pg-custom-window-content';

        // 6. Inhalt (Reihen) generieren und in den Content-Container einfügen
        rowsContent.forEach(content => {
            const row = document.createElement('div');
            row.className = 'pg-custom-window-row';
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
        // Warte auf die Bibliothek (01_header), die Konfiguration (11_test_config) und das CSS (13_test_css)
        if (window.waitForElement && window.PG_TEST_CONFIG && window.PG_TEST_CSS_LOADED) {
            clearInterval(checkDependencies);
            initButtonObserver();
        }
    }, 100);

})();