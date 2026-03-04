// ==UserScript==
// @name         10_produktion
// @namespace    Produktion
// @version      1.1
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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

        window.clearSearchDivButtons();
        const menuButtons = window.PETER_GEMINI_CONFIG.menus[menuName];
        menuButtons.forEach(buttonConfig => {
            window.insertButtonInSearchDiv(
                buttonConfig.id,
                buttonConfig.icon,
                () => window.applyBuildingFilter(buttonConfig.filter),
                buttonConfig.tooltip
            );
        });
    };

    // =============================================================
    // INITIALISIERUNG
    // =============================================================
    // Hier definieren und erstellen wir alle unsere Buttons.

    const ICONS = {
        active: "https://game.logistics-empire.com/assets/search-Dc_debXd.avif",
        inactive: "https://img.icons8.com/fluency/48/cancel.png"
    };

    // Globaler Status für unser gesamtes Skript-Set
    window.pgScriptActive = true;

    // Schaltet den Status um und gibt visuelles Feedback.
    window.togglePgScript = function() {
        window.pgScriptActive = !window.pgScriptActive;
        const displayStyle = window.pgScriptActive ? 'inline-flex' : 'none';

        // Blendet die Header-Buttons als visuelles Feedback ein/aus.
        if (window.headerButtonOrder) {
            window.headerButtonOrder.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = displayStyle;
            });
        }
        if (!window.pgScriptActive && window.clearSearchDivButtons) window.clearSearchDivButtons();

        // Den Toggle-Button selbst aktualisieren (Icon und Tooltip)
        const toggleBtn = document.getElementById('pgScriptToggleButton');
        if (toggleBtn) {
            const img = toggleBtn.querySelector('img');
            if (img) img.src = window.pgScriptActive ? ICONS.active : ICONS.inactive;
            toggleBtn.setAttribute('data-tooltip', window.pgScriptActive ? 'P&G Skripte deaktivieren' : 'P&G Skripte aktivieren');
        }
    };
    
    // Dauerhafte Erstellung des Haupt-Toggle-Buttons im linken Menü
    setInterval(() => {
        const icon = window.pgScriptActive ? ICONS.active : ICONS.inactive;
        const tooltip = window.pgScriptActive ? 'P&G Skripte deaktivieren' : 'P&G Skripte aktivieren';
        if (window.createNavLeftButton) { // Sicherstellen, dass die Funktion aus der Bibliothek geladen ist
            window.createNavLeftButton('pgScriptToggleButton', icon, window.togglePgScript, tooltip);
        }
    }, 1000);

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