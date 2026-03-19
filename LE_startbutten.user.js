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
            
            element.onclick = () => console.log(`${config.id} geklickt`);
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
                { id: 'B1', src: '', isPlaceholder: true },
                { id: 'B2', src: '', isPlaceholder: true },
                { id: 'B3', src: 'https://game.logistics-empire.com/assets/truck_break_bulk_small_huge-BlAVkJv8.avif', isPlaceholder: false }
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

    const observer = new MutationObserver(() => injectButtons());
    observer.observe(document.body, { childList: true, subtree: true });
    injectButtons();
})();