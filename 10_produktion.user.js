// ==UserScript==
// @name         10_produktion
// @namespace    Konfiguration
// @version      1.2
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================
    // 1. SCHRITT: DEFINITION DER MENÜS (Zuerst erzeugen)
    // =============================================================
    // Wir definieren hier, was passiert, wenn man später auf die Buttons klickt.

        window.openLebensmittelMenu = function () {
            window.clearSearchDivButtons();
            window.insertButtonInSearchDiv("btnGewaechshaus", "https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif", () => window.applyBuildingFilter("Gewächshaus"), "Gewächshaus");
            window.insertButtonInSearchDiv("btnTomaten", "https://game.logistics-empire.com/assets/res_ketchup-Leaw1pbo.avif", () => window.applyBuildingFilter("Tomatenfabrik"), "Tomatenfabrik");
            window.insertButtonInSearchDiv("btnGetreide", "https://game.logistics-empire.com/assets/res_wheat-BAv6FNtx.avif", () => window.applyBuildingFilter("Getreidefarm"), "Getreidefarm");
            window.insertButtonInSearchDiv("btnMuehle", "https://game.logistics-empire.com/assets/icon_bld_mill-DaJO0L1l.avif", () => window.applyBuildingFilter("Mühle"), "Mühle");
            window.insertButtonInSearchDiv("btnBaeckerei", "https://game.logistics-empire.com/assets/res_bread-CuVynabW.avif", () => window.applyBuildingFilter("Bäckerei"), "Bäckerei");
            window.insertButtonInSearchDiv("btnSnack", "https://game.logistics-empire.com/assets/res_potato_chips-C4SYE08S.avif", () => window.applyBuildingFilter("Snackmanufaktur"), "Snack");
            window.insertButtonInSearchDiv("btnPommes", "https://game.logistics-empire.com/assets/res_fries-By8mac-R.avif", () => window.applyBuildingFilter("Pommesmanufaktur"), "Pommesmanufaktur");
    };

    window.openFleischMenu = function () {
        window.clearSearchDivButtons();
        window.insertButtonInSearchDiv("btnMetzgerei", "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", () => window.applyBuildingFilter("Metzgerei"), "Metzgerei");
        window.insertButtonInSearchDiv("btnSchlachthof", "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", () => window.applyBuildingFilter("Fleischfabrik"), "Fleischfabrik");
        window.insertButtonInSearchDiv("btnPizza", "https://game.logistics-empire.com/assets/icon_bld_bakery-jjxzNfJk.avif", () => window.applyBuildingFilter("Pizzamanufaktur"), "Pizza");
    };

    window.openStoffeMenu = function () {
        window.clearSearchDivButtons();
        window.insertButtonInSearchDiv("btnBaumwolle", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Faserhof"), "Baumwolle");
        window.insertButtonInSearchDiv("btnSpinnerei", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Spinnerei"), "Spinnerei");
        window.insertButtonInSearchDiv("btnWeberei", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Weberei"), "Weberei");
    };

    window.openKleidungMenu = function () {
        window.clearSearchDivButtons();
        window.insertButtonInSearchDiv("btnKleidung", "https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif", () => window.applyBuildingFilter("Kleidungsfabrik"), "Kleidungsfabrik");
        window.insertButtonInSearchDiv("btnHut", "https://game.logistics-empire.com/assets/icon_bld_hat_manufactory-B_YAS2fA.avif", () => window.applyBuildingFilter("Hutmanufaktur"), "Hutmanufaktur");
    };

    window.openLagerMenu = function () {
        window.clearSearchDivButtons();
        window.insertButtonInSearchDiv("btnLagerT", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Textillager"), "Textillager");
        window.insertButtonInSearchDiv("btnLagerL", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Lebensmittellager"), "Lebensmittellager");
        window.insertButtonInSearchDiv("btnLagerK", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Kartoffellager"), "Kartoffellager");
        window.insertButtonInSearchDiv("btnLagerKl", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Kleidungslager"), "Kleidungslager");
        window.insertButtonInSearchDiv("btnLagerH", "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", () => window.applyBuildingFilter("Hutlager"), "Hutlager");
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
        { id: "headAcker",  icon: "https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif", onClick: window.openLebensmittelMenu, tooltip: "Ackerbau & Snacks" },
        { id: "headFleisch", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", onClick: window.openFleischMenu, tooltip: "Fleisch & Pizza" },
        { id: "headStoffe", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", onClick: window.openStoffeMenu, tooltip: "Stoffe & Garne" },
        { id: "headKleid",  icon: "https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif", onClick: window.openKleidungMenu, tooltip: "Kleidung & Hüte" },
        { id: "headLagerM", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", onClick: window.openLagerMenu, tooltip: "Lager Menü" },
    
    ]);
   
})();