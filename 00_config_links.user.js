// ==UserScript==
// @name         00_Config
// @namespace    Konfiguration
// @version      1.0
// @description  Zentrale Konfigurationsdatei für die PB&G Skripte. Muss als erstes geladen werden.
// @author       PB@G Flöha-Logistik
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==
/* eslint-disable no-multi-spaces */

(function() {
    'use strict';

    // =================================================================================================
    // ZENTRALE KONFIGURATION für alle P&G Skripte
    // Hier werden alle Buttons und Menüs definiert, die in der Header-Leiste erscheinen.
    // =================================================================================================

    window.PETER_GEMINI_CONFIG = {
        // ---------------------------------------------------------------------------------------------
        // 1. HEADER BUTTONS: Die Haupt-Buttons in der oberen Leiste
        //    - 'menu': Verweist auf einen Schlüssel im 'menus'-Objekt unten.
        // ---------------------------------------------------------------------------------------------
        headerButtons: [
            { id: 'headgrundprodunkte', icon: 'https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif',
                tooltip: 'Grundprodukte',     menu: 'grundprodukte' },
            { id: 'headzwischenprodukte', icon: 'https://game.logistics-empire.com/assets/res_salami-BtxmGDdd.avif',
                tooltip: 'Zwischenprodukte',  menu: 'zwischenprodukte' },
            { id: 'headendprodukte', icon: 'https://game.logistics-empire.com/assets/res_pizza_ham-B61H7_r3.avif',
                tooltip: 'Endprodukte',       menu: 'endprodukte' },
            { id: 'headlager', icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif',
                tooltip: 'Lager',             menu: 'lager' },
            { id: 'headstandort', icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif',
                tooltip: 'Standort & Filter', menu: 'standort' }
        ],

        // ---------------------------------------------------------------------------------------------
        // 2. MENÜS: Die Untermenüs, die nach einem Klick auf einen Header-Button erscheinen
        //    - 'filter': Der Text, der in das Suchfeld eingegeben wird.
        //    - 'filter: 'open_filter_panel'': Ein Spezialbefehl, der unser Filter-Overlay öffnet.
        // ---------------------------------------------------------------------------------------------
        menus: {
            grundprodukte: [
                { id: 'btngewaechshaus', icon: 'https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif',
                    filter: '"Gewächshaus"',     tooltip: 'Gewächshaus' },
                { id: 'btnkartoffelhof', icon: 'https://game.logistics-empire.com/assets/res_potato-BLVzwWCr.avif',
                    filter: '"Kartoffelhof"',    tooltip: 'Kartoffelhof' },
                { id: 'btnobstplantage', icon: 'https://game.logistics-empire.com/assets/res_apples-BbrRr_Lr.avif',
                    filter: '"Obstplantage"',    tooltip: 'Obstplantage' },
                { id: 'btnblumen', icon: 'https://game.logistics-empire.com/assets/shop_ctg_flower-D4cl-bHL.avif',
                    filter: '"Blumen"',          tooltip: 'Blumen' },
                { id: 'btngetreide', icon: 'https://game.logistics-empire.com/assets/res_wheat-BAv6FNtx.avif',
                    filter: '"Getreidefarm"',    tooltip: 'Getreide' },
                { id: 'btnmetzgerei', icon: 'https://game.logistics-empire.com/assets/res_chicken_meat-C9s9wQK9.avif',
                    filter: '"Metzgerei"',       tooltip: 'Metzgerei' },
                { id: 'btnbaumwolle', icon: 'https://game.logistics-empire.com/assets/res_cotton-B_b6bOjW.avif',
                    filter: '"Baumwollfarm"',    tooltip: 'Baumwolle' },
                { id: 'btnfarbstoff', icon: 'https://game.logistics-empire.com/assets/res_indigo_dye-DTjNr0Y_.avif',
                    filter: '"Farbstoff"',       tooltip: 'Farbstoff' },
                { id: 'btnfaserhof', icon: 'https://game.logistics-empire.com/assets/res_hemp-BNyOPNvU.avif',
                    filter: '"Faserhof"',        tooltip: 'Faserhof' },
                { id: 'btnviehzucht', icon: 'https://game.logistics-empire.com/assets/res_wool-Dqj3gzZa.avif',
                    filter: '"Viezuchtbetrieb"', tooltip: 'Viehzuchtbetrieb' }
                ],
            zwischenprodukte: [
                { id: 'btnmuehle', icon: 'https://raw.githubusercontent.com/Guldukan/Github-Logistik-Empire/refs/heads/main/ico/Gemini_Generated_Image_xskruuxskruuxskr.ico',
                    filter: '"Mühle"',           tooltip: 'Mühle' },
                { id: 'btnfleischfabri', icon: 'https://game.logistics-empire.com/assets/res_ham-URuk6-Pq.avif',                       filter: '"Fleischfabrik"',   tooltip: 'Fleisch' },
                { id: 'btnspinnerei',    icon: 'https://game.logistics-empire.com/assets/res_cotton_yarn-BGkJD7Gt.avif',               filter: '"Spinnerei"',       tooltip: 'Spinnerei' },
                { id: 'btnweberei',      icon: 'https://game.logistics-empire.com/assets/res_wool_fabric-BHM0wWlR.avif',               filter: '"Weberei"',         tooltip: 'Weberei' }
                ],
            endprodukte: [
                { id: 'btnbaeckerei',    icon: 'https://game.logistics-empire.com/assets/res_bread-CuVynabW.avif',                      filter: '"Bäckerei"',         tooltip: 'Bäckerei' },
                { id: 'btnsnack',        icon: 'https://game.logistics-empire.com/assets/res_potato_chips-C4SYE08S.avif',               filter: '"Snackmanufaktur"',  tooltip: 'Snack' },
                { id: 'btnpommesmanufaktur', icon: 'https://game.logistics-empire.com/assets/res_fries-By8mac-R.avif',                      filter: '"Pommesmanufaktur"', tooltip: 'Pommesmanufaktur' },
                { id: 'btnpommesfabrick',    icon: 'https://game.logistics-empire.com/assets/res_fries-By8mac-R.avif',                      filter: '"Pommesfabrick"', tooltip: 'Pommesfabrick' }, 
                { id: 'btntomaten',      icon: 'https://game.logistics-empire.com/assets/res_ketchup-Leaw1pbo.avif',                    filter: '"Tomatenfabrik"',    tooltip: 'Tomaten' },
                { id: 'btnpizzamanu',    icon: 'https://game.logistics-empire.com/assets/icon_bld_bakery-jjxzNfJk.avif',                filter: '"Pizzamanufaktur"',  tooltip: 'PizzaManufaktur' },
                { id: 'btnpizzafabrik',  icon: 'https://game.logistics-empire.com/assets/icon_bld_bakery-jjxzNfJk.avif',                filter: '"PizzaFabrik"',      tooltip: 'Pizzafabrik' },
                { id: 'btnschneiderei',  icon: 'https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif',             filter: '"Schneider"',        tooltip: 'Schneiderei' },
                { id: 'btntextilmanur',  icon: 'https://game.logistics-empire.com/assets/res_indigo_clothes-JQr_V6yn.avif',             filter: '"Textilmanufaktur"', tooltip: 'Textilmanufaktur' },
                { id: 'btnhut',          icon: 'https://game.logistics-empire.com/assets/icon_bld_hat_manufactory-B_YAS2fA.avif',       filter: '"Hutmanufaktur"',    tooltip: 'Hüte' }
                ],
            lager: [
                { id: 'btnlagerTex',     icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif', filter: '"Textil-Lager"',       tooltip: 'Textil' },
                { id: 'btnlagerLebn',    icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif', filter: '"Lebensmittellager"',  tooltip: 'Lebensmittel' },
                { id: 'btnlagerKart',    icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif', filter: '"Kartoffellager"',     tooltip: 'Kartoffel' },
                { id: 'btnlagerKlwi',    icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif', filter: '"Kleidungslager"',     tooltip: 'Kleidung' },
                { id: 'btnlagerHüte',    icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif', filter: '"Hutlager"',           tooltip: 'Hüte' }
                ],
           standort: [
            
                { id: 'btnerzeugung',         icon: 'https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif',                   filter: 'open_filter_panel:erzeugung',         tooltip: 'Filter für Grundprodukte' },
                { id: 'btnzwischenprodukte',  icon: 'https://game.logistics-empire.com/assets/icon_bld_textile_manufactory-CeYuyD46.avif',   filter: 'open_filter_panel:zwischenprodukte',  tooltip: 'Filter für Zwischenprodukte' },
                { id: 'btnendprodukte',       icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif', filter: 'open_filter_panel:endprodukte',       tooltip: 'Filter für Endprodukte' },
                { id: 'btn_standort',       icon: 'https://game.logistics-empire.com/assets/icon_bld_warehouse_dry_textile-CO0nTVe8.avif',   filter: 'open_filter_panel:endprodukte',       tooltip: 'Filter für Endprodukte' }
                ]
        },

        // -------------------------------------------------------------------------------------
        // 3. KARTEN-FILTER PANEL: Gebäude, die im Overlay-Filter ein/ausgeblendet werden können
        // --------------------------------------------------------------------------------------
        filterGroups: {
            erzeugung: [
                { name: 'Gewächshaus',     icon_part: 'icon_bld_greenhouse' },
                { name: 'Metzgerei',       icon_part: 'icon_bld_butchery_detail' },
                { name: 'Kartoffelhof',    icon_part: 'icon_bld_potato_farm' },
                { name: 'Obstplantage',    icon_part: 'icon_bld_orchard' },
                { name: 'Getreidefarm',    icon_part: 'icon_bld_grain_farm' },
                { name: 'Baumwollfarm',    icon_part: 'icon_bld_cotton_plantation' },
                { name: 'Faserhof',        icon_part: 'icon_bld_fiber_farm' },
                { name: 'Farbstoff',       icon_part: 'icon_bld_indigo_farm' }
            ],
            zwischenprodukte: [
                { name: 'Mühle',           icon_part: 'icon_bld_mill' },
                { name: 'Fleischfabrik',   icon_part: 'icon_bld_meat_factory' },
                { name: 'Tomatenfabrik',   icon_part: 'icon_bld_ketchup_factory' },
                { name: 'Spinnerei',       icon_part: 'icon_bld_spinning_mill' },
                { name: 'Weberei',         icon_part: 'icon_bld_weaving_mill' }
            ],
            endprodukte: [
                { name: 'Bäckerei',         icon_part: 'icon_bld_bakery' },
                { name: 'Schneiderei',      icon_part: 'icon_bld_tailor' },
                { name: 'Textilmanufaktur', icon_part: 'icon_bld_textile_manufactory' },
                { name: 'Hutmanufaktur',    icon_part: 'icon_bld_hat_manufactory' },
                { name: 'Snackmanufaktur',  icon_part: 'icon_bld_snack_factory' },
                { name: 'Pommesmanufaktur', icon_part: 'icon_bld_fries_factory' },
                { name: 'Pizzamanufaktur',  icon_part: 'icon_bld_pizza_factory' }
            ],
            lager: [
                { name: 'Textil-Lager',       icon_part: 'icon_bld_warehouse_dry_textile' },
                { name: 'Lebensmittellager',  icon_part: 'icon_bld_warehouse_dry_textile' },
                { name: 'Kartoffellager',     icon_part: 'icon_bld_warehouse_dry_textile' },
                { name: 'Kleidungslager',     icon_part: 'icon_bld_warehouse_dry_textile' },
                { name: 'Hutlager',           icon_part: 'icon_bld_warehouse_dry_textile' }
            ]
            
        }
    };

})();