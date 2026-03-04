// ==UserScript==
// @name         00_Config
// @namespace    Konfiguration
// @version      1.0
// @description  Zentrale Konfigurationsdatei für die P&G Skripte. Muss als erstes geladen werden.
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.PETER_GEMINI_CONFIG = {
        headerButtons: [
            { id: "headAcker",  icon: "https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif", tooltip: "Ackerbau", menu: "lebensmittel" },
            { id: "headFleisch", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", tooltip: "Fleisch", menu: "fleisch" },
            { id: "headStoffe", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", tooltip: "Stoffe", menu: "stoffe" },
            { id: "headKleid",  icon: "https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif", tooltip: "Kleidung", menu: "kleidung" },
            { id: "headLagerM", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", tooltip: "Lager", menu: "lager" }
        ],
        menus: {
            lebensmittel: [
                { id: "btnGewaechshaus", icon: "https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif", filter: "Gewächshaus", tooltip: "Gewächshaus" },
                { id: "btnTomaten", icon: "https://game.logistics-empire.com/assets/res_ketchup-Leaw1pbo.avif", filter: "Tomatenfabrik", tooltip: "Tomaten" },
                { id: "btnGetreide", icon: "https://game.logistics-empire.com/assets/res_wheat-BAv6FNtx.avif", filter: "Getreidefarm", tooltip: "Getreide" },
                { id: "btnMuehle", icon: "https://game.logistics-empire.com/assets/icon_bld_mill-DaJO0L1l.avif", filter: "Mühle", tooltip: "Mühle" },
                { id: "btnBaeckerei", icon: "https://game.logistics-empire.com/assets/res_bread-CuVynabW.avif", filter: "Bäckerei", tooltip: "Bäckerei" },
                { id: "btnSnack", icon: "https://game.logistics-empire.com/assets/res_potato_chips-C4SYE08S.avif", filter: "Snackmanufaktur", tooltip: "Snack" },
                { id: "btnPommes", icon: "https://game.logistics-empire.com/assets/res_fries-By8mac-R.avif", filter: "Pommesmanufaktur", tooltip: "Pommes" }
            ],
            fleisch: [
                { id: "btnMetzgerei", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", filter: "Metzgerei", tooltip: "Metzgerei" },
                { id: "btnSchlachthof", icon: "https://game.logistics-empire.com/assets/icon_bld_meat_factory-DeFS9SW1.avif", filter: "Fleischfabrik", tooltip: "Fleisch" },
                { id: "btnPizza", icon: "https://game.logistics-empire.com/assets/icon_bld_bakery-jjxzNfJk.avif", filter: "Pizzamanufaktur", tooltip: "Pizza" }
            ],
            stoffe: [
                { id: "btnBaumwolle", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Faserhof", tooltip: "Baumwolle" },
                { id: "btnSpinnerei", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Spinnerei", tooltip: "Spinnerei" },
                { id: "btnWeberei", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Weberei", tooltip: "Weberei" }
            ],
            kleidung: [
                { id: "btnKleidung", icon: "https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif", filter: "Kleidungsfabrik", tooltip: "Kleidungs" },
                { id: "btnHut", icon: "https://game.logistics-empire.com/assets/icon_bld_hat_manufactory-B_YAS2fA.avif", filter: "Hutmanufaktur", tooltip: "Hüte" }
            ],
            lager: [
                { id: "btnLagerT", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Textillager", tooltip: "Textil" },
                { id: "btnLagerL", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Lebensmittellager", tooltip: "Lebensmittel" },
                { id: "btnLagerK", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Kartoffellager", tooltip: "Kartoffel" },
                { id: "btnLagerKl", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Kleidungslager", tooltip: "Kleidungs" },
                { id: "btnLagerH", icon: "https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif", filter: "Hutlager", tooltip: "Hüte" }
            ]
        }
    };

})();