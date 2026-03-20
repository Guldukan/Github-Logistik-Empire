// ==UserScript==
// @name         LE_startbutten
// @namespace    LE_startbutten
// @version      2.0
// @description  B1-B3 links beim Trade-Center, B4-B6 rechts nach Einstellungen
// @author       Peter
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Zustand für die Sichtbarkeit der Header-Buttons. Startet mit "ausgeblendet".
    let headerButtonsVisible = false;

    function setHeaderButtonsVisibility(visible) {
        document.querySelectorAll('.pb-header-btn').forEach(btn => {
            btn.style.display = visible ? 'inline-flex' : 'none';
        });
        headerButtonsVisible = visible;
    }

    function createNavSection(id, configs) {
        const customWrapper = document.createElement('div');
        customWrapper.id = id;
        customWrapper.className = 'flex items-center';

        configs.forEach((config) => {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'flex shrink-0 items-center px-2';
            
            let element;
            if (config.isPlaceholder) {
                element = document.createElement('div');
                element.innerText = config.id;
                element.className = 'le-placeholder-btn';
            } else {
                element = document.createElement('img');
                element.src = config.src;
                element.className = 'le-icon-btn image-shadow';
                element.draggable = false;
            }
            
            element.onclick = config.onClick ? config.onClick : () => console.log(`${config.id} geklickt`);
            btnContainer.appendChild(element);
            
            const divider = document.createElement('div');
            divider.className = 'le-nav-divider';
            
            customWrapper.appendChild(btnContainer);
            customWrapper.appendChild(divider);
        });
        return customWrapper;
    }

    function injectButtons() {
        // --- LINKS: B1, B2, B3 (beim Trade Center) ---
        const tradeCenter = document.querySelector('[data-tutorial-id="navigation-main-trade-center"]');
        const leftNav = tradeCenter ? tradeCenter.closest('.flex.shrink-0.items-center') : null;
        
        if (leftNav && !document.getElementById('custom-nav-left')) {
            const leftConfigs = [
                { 
                    id: 'B1', 
                    src: 'https://game.logistics-empire.com/assets/shop_ctg_textiles-BCF4KR7y.avif', 
                    isPlaceholder: false,
                    onClick: () => {
                        // Gleiche Funktion wie B2: Schaltet die Leiste oben um
                        setHeaderButtonsVisibility(!headerButtonsVisible);
                    }
                },
                { 
                    id: 'B2', 
                    src: 'https://game.logistics-empire.com/assets/shop_ctg_food_processing-DPmu_XnS.avif', 
                    isPlaceholder: false,
                    onClick: () => {
                        setHeaderButtonsVisibility(!headerButtonsVisible);
                    }
                },
                { 
                    id: 'B3', 
                    src: 'https://game.logistics-empire.com/assets/truck_break_bulk_small_huge-BlAVkJv8.avif',
                    isPlaceholder: false,
                    onClick: () => {
                        if (window.openContentPanel && window.showOrdersOverlay) {
                            window.openContentPanel("Aufträge Trade-Center", window.showOrdersOverlay);
                        } else {
                            console.log("P&G: Funktionen noch nicht geladen.");
                        }
                    }
                }
            ];
            leftNav.before(createNavSection('custom-nav-left', leftConfigs));
        }

        // --- RECHTS: B4, B5, B6 (nach Einstellungen) ---
        const settingsBtn = document.querySelector('[data-tutorial-id="navigation-main-settings"]');
        // Das übergeordnete Element des Einstellungs-Buttons finden
        const settingsWrapper = settingsBtn ? settingsBtn.closest('.flex.shrink-0.items-center') : null;
        
        if (settingsWrapper && !document.getElementById('custom-nav-right')) {
            const rightConfigs = [
                { id: 'B4', src: '', isPlaceholder: true },
                { id: 'B5', src: '', isPlaceholder: true },
                { id: 'B6', src: 'https://game.logistics-empire.com/assets/truck_break_bulk_small_huge-BlAVkJv8.avif', isPlaceholder: false }
            ];
            // .after() setzt es direkt hinter das Einstellungs-Element
            settingsWrapper.after(createNavSection('custom-nav-right', rightConfigs));
        }
    }

    const observer = new MutationObserver(() => {
        injectButtons();
        // Stellt sicher, dass der Zustand (sichtbar/unsichtbar) auch nach DOM-Änderungen beibehalten wird.
        setHeaderButtonsVisibility(headerButtonsVisible);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Führt die Funktionen einmal initial aus.
    injectButtons();
    setHeaderButtonsVisibility(false); // Stellt sicher, dass die Leiste am Anfang ausgeblendet ist.
})();