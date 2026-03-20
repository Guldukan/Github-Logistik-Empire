// ==UserScript==
// @name         02_produktion
// @namespace    Produktion
// @version      1.1
// @description  Funktion zum Ausblenden von Schneider-Markern.
// @author       PB@G Flöha-Logistik
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let activeMenu = null;

    // Wartet, bis die Bibliothek und die Konfiguration geladen sind.
    function waitForDependencies(callback) {
        const interval = setInterval(() => {
            if (window.initHeaderButtons && window.PETER_GEMINI_CONFIG) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

   // Generische Funktion zum Öffnen eines Untermenüs basierend auf dem Konfigurations-Objekt.
window.openSubMenu = function(menuName) {
    if (!window.PETER_GEMINI_CONFIG || !window.PETER_GEMINI_CONFIG.menus[menuName]) {
        console.error(`P&G Skript: Menü "${menuName}" nicht in der Konfiguration gefunden.`);
        return;
    }

    if (activeMenu === menuName) {
        window.clearSearchDivButtons();
        activeMenu = null;
        return;
    }

    window.clearSearchDivButtons();
    activeMenu = menuName;
    const menuButtons = window.PETER_GEMINI_CONFIG.menus[menuName];

// In der 10_produktion die Schleife anpassen:
    menuButtons.forEach(buttonConfig => {
        window.insertButtonInSearchDiv(
        buttonConfig.id,
        buttonConfig.icon,
        () => {
            // Prüfung: Wenn der Filter unser "Befehl" ist, öffne das Panel
            if (buttonConfig.filter.startsWith('open_filter_panel')) {
                const parts = buttonConfig.filter.split(':');
                const filterGroup = parts[1]; // z.B. 'erzeugung'
                if (window.PETER_GEMINI_CONFIG.filterGroups && window.PETER_GEMINI_CONFIG.filterGroups[filterGroup]) {
                    const buildings = window.PETER_GEMINI_CONFIG.filterGroups[filterGroup];
                    // Wir rufen die Panel-Funktion mit der Gruppe und der passenden Gebäudeliste auf
                    window.toggleBuildingFilterPanel(filterGroup, buildings);
                } else {
                    console.error(`P&G Skript: Filter-Gruppe "${filterGroup}" nicht in der Konfiguration gefunden.`);
                }
            } else {
                window.applyBuildingFilter(buttonConfig.filter, buttonConfig.id);
            }
        },
           buttonConfig.tooltip
          );
        });
    };

    // =============================================================
    // INITIALISIERUNG
    // =============================================================
    // Hier definieren und erstellen wir alle unsere Buttons.

    // Initialisiert die Header-Buttons, sobald die Abhängigkeiten bereit sind.
    waitForDependencies(() => {
        const headerButtonsForInit = window.PETER_GEMINI_CONFIG.headerButtons.map(btn => ({
            id: btn.id,
            icon: btn.icon,
            // Die Klick-Aktion ruft unsere neue, generische Funktion auf.
            onClick: () => window.openSubMenu(btn.menu),
            tooltip: btn.tooltip
        }));

        window.initHeaderButtons(headerButtonsForInit);
    });

})();