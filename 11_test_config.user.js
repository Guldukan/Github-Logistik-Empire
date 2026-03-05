// ==UserScript==
// @name         11_Test_Config
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Konfiguration für die Test-Skripte
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.PG_TEST_CONFIG = {
        nativeHeaderButtons: [
            {
                id: 'pg-arbeitzplatz-button',
                icon: 'https://game.logistics-empire.com/assets/navbar_main_business-BYA_FCr1.avif',
                tooltip: 'Arbeitsplatz',
                onClick: () => {
                    if (window.PG_toggleCustomWindow) {
                        window.PG_toggleCustomWindow("Mein Arbeitsplatz", ["Reihe 1: Hier könnte deine Werbung stehen.", "Reihe 2: Status - Alles im grünen Bereich."]);
                    } else {
                        console.error("PG_toggleCustomWindow noch nicht geladen");
                    }
                }
            },
            {
                id: 'pg-test-button',
                icon: 'https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif',
                tooltip: 'Test Button (Filter)',
                // Beispiel für eine komplexere Aktion, die eine Funktion aus 01_header.user.js nutzt
                onClick: () => window.applyBuildingFilter && window.applyBuildingFilter('Tomatenfabrik')
            }
        ]
    };
})();
