// ==UserScript==
// @name         10_produktion
// @namespace    Konfiguration
// @version      1.3
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================
    // 1. SCHRITT: ZENTRALE KONFIGURATION DER MENÜS
    // =============================================================
    const MENU_DEFINITIONS = {
        'lebensmittel': [
            { id: "btnGewaechshaus", icon: "https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif", filter: "Gewächshaus", tooltip: "Gewächshaus" },
            { id: "btnTomaten", icon: "https://game.logistics-empire.com/assets/res_ketchup-Leaw1pbo.avif", filter: "Tomatenfabrik", tooltip: "Tomaten" },
            { id: "btnGetreide", icon: "https://game.logistics-empire.com/assets/res_wheat-BAv6FNtx.avif", filter: "Getreidefarm", tooltip: "Getreide" },
            { id: "btnMuehle", icon: "https://game.logistics-empire.com/assets/icon_bld_mill-DaJO0L1l.avif", filter: "Mühle", tooltip: "Mühle" },
            { id: "btnBaeckerei", icon: "https://game.logistics-empire.com/assets/res_bread-CuVynabW.avif", filter: "Bäckerei", tooltip: "Bäckerei" },
            { id: "btnSnack", icon: "https://game.logistics-empire.com/assets/res_potato_chips-C4SYE08S.avif", filter: "Snackmanufaktur", tooltip: "Snack" },
            { id: "btnPommes", icon: "https://game.logistics-empire.com/assets/res_fries-By8mac-R.avif", filter: "Pommesmanufaktur", tooltip: "Pommes" },
        ],
        'fleisch': [
            { id: "btnMetzgerei", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", filter: "Metzgerei", tooltip: "Metzgerei" },
            { id: "btnSchlachthof", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", filter: "Fleischfabrik", tooltip: "Fleisch" },
            { id: "btnPizza", icon: "https://game.logistics-empire.com/assets/icon_bld_bakery-jjxzNfJk.avif", filter: "Pizzamanufaktur", tooltip: "Pizza" },
        ],
        'stoffe': [
            { id: "btnBaumwolle", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Faserhof", tooltip: "Baumwolle" },
            { id: "btnSpinnerei", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Spinnerei", tooltip: "Spinnerei" },
            { id: "btnWeberei", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Weberei", tooltip: "Weberei" },
        ],
        'kleidung': [
            { id: "btnKleidung", icon: "https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif", filter: "Kleidungsfabrik", tooltip: "Kleidungs" },
            { id: "btnHut", icon: "https://game.logistics-empire.com/assets/icon_bld_hat_manufactory-B_YAS2fA.avif", filter: "Hutmanufaktur", tooltip: "Hüte" },
        ],
        'lager': [
            { id: "btnLagerT", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Textillager", tooltip: "Textil" },
            { id: "btnLagerL", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Lebensmittellager", tooltip: "Lebensmittel" },
            { id: "btnLagerK", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Kartoffellager", tooltip: "Kartoffel" },
            { id: "btnLagerKl", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Kleidungslager", tooltip: "Kleidungs" },
            { id: "btnLagerH", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Hutlager", tooltip: "Hüte" },
        ]
    };

    // Generische Funktion, um ein Untermenü basierend auf dem Namen zu erstellen
    window.createSubMenu = function(menuName) {
        window.clearSearchDivButtons();
        const buttons = MENU_DEFINITIONS[menuName];
        if (!buttons) return;

        buttons.forEach(btn => {
            window.insertButtonInSearchDiv(btn.id, btn.icon, () => window.applyBuildingFilter(btn.filter), btn.tooltip);
        });
    };

    // =============================================================
    // 2. SCHRITT: INITIALISIERUNG (Ganz am Ende)
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

    // Initialisierung der Header-Buttons (ohne den alten Toggle-Button)
    window.initHeaderButtons([
        { id: "headAcker",  icon: "https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif", onClick: () => window.createSubMenu('lebensmittel'), tooltip: "Ackerbau" },
        { id: "headFleisch", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", onClick: () => window.createSubMenu('fleisch'), tooltip: "Fleisch" },
        { id: "headStoffe", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", onClick: () => window.createSubMenu('stoffe'), tooltip: "Stoffe" },
        { id: "headKleid",  icon: "https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif", onClick: () => window.createSubMenu('kleidung'), tooltip: "Kleidung" },
        { id: "headLagerM", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", onClick: () => window.createSubMenu('lager'), tooltip: "Lager" },
    ]);
   
})();