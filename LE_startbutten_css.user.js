// ==UserScript==
// @name         LE_startbutten_css
// @namespace    LE_scripts
// @version      1.0
// @description  Zentrales CSS für Logistics Empire Erweiterungen
// @author       Peter
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.id = 'le-custom-styles';
    style.innerHTML = `
        /* Container für die neuen Buttons */
        #custom-nav-section {
            display: flex;
            align-items: center;
        }

        /* Design für die Platzhalter-Buttons (B1, B2) */
        .le-placeholder-btn {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px dashed #4a5568;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #718096;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .le-placeholder-btn:hover {
            border-color: #a0aec0;
            color: #cbd5e0;
            background: rgba(255, 255, 255, 0.15);
        }

        /* Design für das Truck-Icon / Bilder */
        .le-icon-btn {
            width: 64px; /* entspricht size-16 */
            height: 64px;
            object-fit: contain;
            cursor: pointer;
            transition: transform 0.15s ease;
        }

        .le-icon-btn:hover {
            transform: scale(1.1);
        }

        /* Der Trennstrich */
        .le-nav-divider {
            height: 48px; /* Entspricht h-4/5 in der Nav */
            border-right: 4px solid rgba(255, 255, 255, 0.8);
            margin: 0 8px;
        }
    `;
    document.head.appendChild(style);
})();