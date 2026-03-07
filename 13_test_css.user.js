// ==UserScript==
// @name         13_Test_CSS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stellt zentrale CSS-Stile für die Test-Skripte bereit
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
        'use strict';

     const css = `
        #pg-custom-window {
            position: fixed;
            top: 8%;
            left: 3%;
            background-color: rgb(30, 41, 59);
            color: rgb(241, 245, 249);
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.8);
            z-index: 10000;
    
            /* Maße für Breite und Höhe */
            width: 650px;            /* Feste Breite */
            max-width: 90vw;         /* Schutz für kleinere Bildschirme */
            min-height: 450px;       /* Mindesthöhe, damit es wertig aussieht */
            max-height: 80vh;        /* Maximale Höhe (80% des Bildschirms) */
    
        /* Box-Modell Korrektur */
           box-sizing: border-box;  /* Padding wird in die Breite/Höhe eingerechnet */
    
           border: 2px solid rgb(71, 85, 105);
           font-family: sans-serif;
           display: flex;
           flex-direction: column;
           padding: 20px;
           }

        #pg-custom-window .pg-custom-window-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            color: rgb(148, 163, 184);
            cursor: pointer;
            font-size: 18px;
        }

        #pg-custom-window h3 {
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid rgb(51, 65, 85);
            padding-bottom: 10px;
        }

        #pg-custom-window-content {
            overflow-y: auto;
            padding-right: 10px; /* Platz für Scrollbar, vermeidet "springen" */
            margin-right: -10px; /* gleicht paddingRight aus */
        }

        #pg-custom-window .pg-custom-window-row {
            margin-bottom: 10px;
            padding: 12px;
            background-color: rgb(15, 23, 42);
            border-radius: 6px;
            border: 1px solid rgb(51, 65, 85);
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);

    // Setze eine globale Variable, um zu signalisieren, dass das CSS geladen ist.
    window.PG_TEST_CSS_LOADED = true;
})();
