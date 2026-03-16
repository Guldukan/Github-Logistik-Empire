// ==UserScript==
// @name         12_Test_CSS
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  CSS mit fester Fenstergröße und kaskadierenden Sektionen
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function injectGlobalCSS() {
        const css = `
            /* ------ PG Global Styles (Peter & Gemi) ------ */

            /* Styles für 12_test_header_rechts */
            .pg-status-item {
                display: flex;
                align-items: center;
                margin: 0 10px;
                pointer-events: auto; /* Erlaubt Klicks im Header */
            }

            .pg-status-item .separator {
                height: 2.5rem; /* 40px */
                border-right: 2px solid rgba(255, 255, 255, 0.2);
                margin-right: 0.5rem; /* 8px */
            }

            .pg-status-item .container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 54px;
                height: 54px;
            }

            .pg-status-item .icon {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                opacity: 0.2;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .pg-status-item .value-text {
                font-size: 14px;
                font-weight: bold;
                z-index: 10;
                color: #fff;
                text-shadow: 1px 1px 2px #000;
            }

            .pg-status-item .bar-background {
                width: 40px;
                height: 4px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 2px;
                overflow: hidden;
                z-index: 10;
                margin-top: 2px;
            }

            .pg-status-item .bar-foreground {
                height: 100%;
                transition: width 0.5s ease;
            }

            /* ------ Farb-Definitionen (aus JS exportiert) ------ */
            
            /* Standard-Farben je nach ID */
            .pg-color-muehle   { background-color: #3498db; }
            .pg-color-status_2 { background-color: #2ecc71; }
            .pg-color-status_3 { background-color: #f1c40f; }
            .pg-color-status_4 { background-color: #e67e22; }
            .pg-color-status_5 { background-color: #e74c3c; }

            /* Status-Zustände (Überschreiben die Standard-Farbe) */
            .pg-status-ok {
                background-color: #2ecc71 !important;
            }
            .pg-status-warn {
                background-color: #f39c12 !important;
            }
            .pg-status-alert {
                background-color: #e74c3c !important;
            }

            /* ------ Modul Styles (Tabellen & Listen für Datei 13) ------ */
            .pg-table {
                width: 100%;
                border-collapse: collapse;
            }
            .pg-table th {
                text-align: left;
                border-bottom: 2px solid #555;
                background: #f0f0f0;
                padding: 8px;
            }
            .pg-table td {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
            .pg-btn-icon {
                margin-right: 5px;
                cursor: pointer;
            }
        `;

        const styleId = 'pg-global-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = css;
            document.head.appendChild(style);
        }
    }

    // Styles sofort und bei Bedarf erneut injizieren (falls das Spiel sie entfernt)
    injectGlobalCSS();
    setInterval(injectGlobalCSS, 3000); // Regelmäßige Überprüfung

})();