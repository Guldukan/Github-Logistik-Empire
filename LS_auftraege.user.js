// ==UserScript==
// @name         LS_auftraege
// @namespace    Logistik
// @version      1.0
// @description  Liest Auftragsdaten aus dem Trade-Center (basierend auf ki.txt Struktur)
// @author       Peter
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================
    // DATEN AUSLESEN (Parsing)
    // =============================================================
    
    window.readTradeCenterOrders = function() {
        const panels = document.querySelectorAll('.action-panel');
        const orders = [];

        panels.forEach(panel => {
            // Wir suchen nur Panels, die "Benötigte Produkte" enthalten (das sind Aufträge)
            if (!panel.textContent.includes('Benötigte Produkte')) return;

            // 1. Name & Adresse
            const buildingNameEl = panel.querySelector('.text-h2');
            const buildingName = buildingNameEl ? buildingNameEl.textContent.trim() : 'Unbekannt';
            
            const addressEl = panel.querySelector('.text-p2-700.line-clamp-2');
            const address = addressEl ? addressEl.textContent.trim() : '';

            // 2. Produkte & Bezahlung
            const products = [];
            let payment = '0';
            
            // Wir suchen alle Tiles (kleine Bild-Boxen) im Panel
            const tiles = panel.querySelectorAll('.bb-base-tile');
            
            tiles.forEach(tile => {
                const bbid = tile.getAttribute('bbid'); // Format z.B. "73:74" (ID:Menge)
                const img = tile.querySelector('img')?.src;
                // Die Menge steht oft in einem number-flow-vue Element (aria-label="74")
                const amountLabel = tile.querySelector('number-flow-vue')?.getAttribute('aria-label');
                
                if (bbid) {
                    const parts = bbid.split(':');
                    const id = parts[0];
                    const rawAmount = parts[1];
                    
                    // ID 1 ist die Währung (Bucks)
                    if (id === '1') {
                        payment = amountLabel || rawAmount;
                    } else {
                        // Alles andere sind Produkte
                        products.push({
                            id: id,
                            amount: amountLabel || rawAmount,
                            img: img
                        });
                    }
                }
            });

            // 3. Zeit / Timer (rotes Label mit Uhr-Icon)
            const timerEl = panel.querySelector('.bb-label-container.variant--alert') || panel.querySelector('.bb-label-container');
            const time = timerEl ? timerEl.textContent.trim() : 'Unbekannt';

            // 4. Buttons (Karte & Start)
            // Karte: Button mit Bild 'tobuildingonmap'
            const mapBtn = panel.querySelector('button img[src*="tobuildingonmap"]')?.closest('button');
            // Start: Button mit Tutorial-ID 'tutorial.view.tradecenter.requests'
            const startBtn = panel.querySelector('button[data-tutorial-id="tutorial.view.tradecenter.requests"]');

            orders.push({
                building: buildingName,
                address: address,
                products: products,
                payment: payment,
                time: time,
                mapBtn: mapBtn,
                startBtn: startBtn
            });
        });

        return orders;
    };

    // =============================================================
    // AUTOMATISIERUNG (Schritt für Schritt)
    // =============================================================

    window.startAuftragSequenz = function(originalStartBtn) {
        if (!originalStartBtn) return;
        
        console.log("P&G: Schritt 1 - Klicke 'Transport starten'...");
        originalStartBtn.click();

        setTimeout(() => {
            console.log("P&G: Schritt 2 - Suche Auswahl-Möglichkeit...");

            // Priorität 1: "Auto-Select" (Zauberstab)
            let selectBtn = document.querySelector('button[data-tutorial-id="transport-assistant"]');
            
            // Priorität 2: Falls Zauberstab fehlt, nimm den ersten "MAX"-Button
            if (!selectBtn) {
                selectBtn = document.querySelector('button[data-tutorial-id="transport-source-resource-input-max"]');
            }

            if (selectBtn) {
                console.log("P&G: Auswahl gefunden, klicke...");
                selectBtn.click();
            } else {
                console.warn("P&G: Keine automatische Auswahl gefunden. Prüfe Fenster.");
            }

            // Schritt 3: 10 Sekunden warten
            console.log("P&G: Warte 10 Sekunden...");
            
            setTimeout(() => {
                console.log("P&G: 10 Sekunden um. Suche 'Losfahren'...");
                
                let executeBtn = document.querySelector('button[data-tutorial-id="start-transport-execution"]');
                
                if (executeBtn) {
                    executeBtn.click();
                    console.log("P&G: Transport gestartet!");
                } else {
                    console.error("P&G: 'Losfahren'-Button nicht gefunden. Bin ich auf der richtigen Seite?");
                }
            }, 10000); // 10 Sekunden Pause
        }, 1500); // 1.5 Sekunden warten
    };

    // =============================================================
    // DARSTELLUNG (Overlay Tabelle)
    // =============================================================

    window.showOrdersOverlay = function(contentContainer) {
        contentContainer.innerHTML = '';
        
        const title = document.createElement('h2');
        title.textContent = 'Aktuelle Aufträge (Trade Center)';
        title.style.cssText = 'margin-bottom: 15px; color: #FFB6C1; text-align: center; font-size: 1.2em;';
        contentContainer.appendChild(title);

        const orders = window.readTradeCenterOrders();

        if (orders.length === 0) {
            contentContainer.innerHTML += `
                <div style="text-align:center; padding: 20px; color: orange;">
                    <p>Keine Aufträge gefunden.</p>
                    <p style="font-size:0.9em; color:#ccc;">Bitte öffne zuerst das <b>Trade-Center</b> im Spiel!</p>
                </div>`;
            return;
        }

        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse; font-size: 14px;';
        table.innerHTML = `
            <thead>
                <tr style="background: #333; color: white; text-align: left;">
                    <th style="padding: 8px;">Ziel</th>
                    <th style="padding: 8px;">Benötigt</th>
                    <th style="padding: 8px;">Lohn</th>
                    <th style="padding: 8px;">Zeit</th>
                    <th style="padding: 8px; text-align: center;">Aktion</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        // Wir nehmen nur den ersten Auftrag (Index 0 bis 1) aus der Liste
        orders.slice(0, 1).forEach(order => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #444';
            
            // Produkte als kleine Bilder darstellen
            let productsHtml = '<div style="display:flex; gap:6px; flex-wrap:wrap;">';
            order.products.forEach(p => {
                productsHtml += `
                    <div style="position:relative; width:32px; height:32px;" title="Menge: ${p.amount}">
                        <img src="${p.img}" style="width:100%; height:100%; border-radius:4px; border:1px solid #555;">
                        <span style="position:absolute; bottom:-4px; right:-4px; background:rgba(0,0,0,0.8); color:white; font-size:9px; padding:1px 3px; border-radius:3px;">${p.amount}</span>
                    </div>
                `;
            });
            productsHtml += '</div>';

            tr.innerHTML = `
                <td style="padding: 8px;">
                    <div style="font-weight:bold; color: #eee;">${order.building}</div>
                    <div style="font-size:0.85em; color: #999;">${order.address}</div>
                </td>
                <td style="padding: 8px;">${productsHtml}</td>
                <td style="padding: 8px; font-weight:bold; color: #81C784;">${order.payment}</td>
                <td style="padding: 8px; color: #E57373;">${order.time}</td>
                <td style="padding: 8px; text-align: center;" class="actions-cell"></td>
            `;

            // Buttons einfügen (damit die Klick-Events erhalten bleiben)
            const actionCell = tr.querySelector('.actions-cell');
            
            if (order.mapBtn) {
                const btn = document.createElement('button');
                btn.innerHTML = '📍';
                btn.title = 'Auf Karte zeigen';
                btn.style.cssText = 'background:none; border:1px solid #555; cursor:pointer; margin-right:5px; padding: 4px; border-radius: 4px; font-size: 16px;';
                btn.onclick = () => order.mapBtn.click();
                actionCell.appendChild(btn);
            }

            if (order.startBtn) {
                const btn = document.createElement('button');
                btn.innerHTML = '🚚';
                btn.title = 'Transport starten';
                btn.style.cssText = 'background: #2E7D32; border:none; cursor:pointer; padding: 4px; border-radius: 4px; font-size: 16px;';
                btn.onclick = () => order.startBtn.click();
                actionCell.appendChild(btn);
            }

            tbody.appendChild(tr);
        });

        contentContainer.appendChild(table);
    };

    console.log("LS_auftraege (P&G) geladen.");
})();