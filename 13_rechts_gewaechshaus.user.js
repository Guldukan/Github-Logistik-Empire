// ==UserScript==
// @name         13_Modul_Gewaechshaus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Logik-Modul mit klickbaren Buttons
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.startGewaechshausLogik = function(contentContainer) {
        contentContainer.innerHTML = ''; 

        const title = document.createElement('h2');
        title.textContent = 'Meine Gebäude-Steuerung';
        title.style.marginBottom = '10px';
        contentContainer.appendChild(title);

        const cards = document.querySelectorAll('.building-card');
        
        if (cards.length === 0) {
            contentContainer.innerHTML += '<p style="color:orange;">Keine Gebäude gefunden. Bitte die Liste im Spiel öffnen!</p>';
            return;
        }

        const listTable = document.createElement('table');
        listTable.className = 'pg-table'; // Neue Klasse aus CSS
        listTable.innerHTML = `
            <tr>
                <th>Stufe</th>
                <th>Name</th>
                <th>Status</th>
                <th>Aktion</th>
            </tr>
        `;

        cards.forEach(card => {
            const name = card.querySelector('.text-h2')?.textContent || 'Unbekannt';
            const level = card.querySelector('.text-center.whitespace-pre-wrap')?.textContent.replace(/Stufe|\n|\r/g, '').trim() || '?';
            const statusLabel = card.querySelector('.bb-label-container');
            const statusText = statusLabel?.textContent || 'Läuft';
            
            let statusColor = 'green'; 
            if (statusLabel?.classList.contains('variant--alert')) statusColor = 'red';
            else if (statusLabel?.classList.contains('variant--warning')) statusColor = 'orange';

            // Die Original-Buttons aus der Spiel-Karte finden
            const btnPage = card.querySelector('button img[src*="tobuildingpage"]')?.parentElement;
            const btnMap = card.querySelector('button img[src*="tobuildingonmap"]')?.parentElement;

            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #eee';
            
            // Tabellen-Zellen erstellen
            row.innerHTML = `
                <td style="padding: 8px;">${level}</td>
                <td style="padding: 8px;"><strong>${name}</strong></td>
                <td style="padding: 8px; color: ${statusColor}; font-weight: bold; font-size: 0.9em;">${statusText}</td>
                <td style="padding: 8px;" class="action-cell"></td>
            `;

            const actionCell = row.querySelector('.action-cell');

            // Button 1: Details (Blaues Icon/Haus)
            if (btnPage) {
                const b1 = document.createElement('button');
                b1.innerHTML = '📄'; // Oder ein Icon-Bild
                b1.title = 'Details öffnen';
                b1.style.marginRight = '5px';
                b1.onclick = () => btnPage.click(); // Simuliert den Klick im Spiel
                actionCell.appendChild(b1);
            }

            // Button 2: Karte (Fadenkreuz/Pin)
            if (btnMap) {
                const b2 = document.createElement('button');
                b2.innerHTML = '📍';
                b2.title = 'Auf Karte zeigen';
                b2.className = 'pg-btn-icon';
                b2.onclick = () => btnMap.click(); // Simuliert den Klick im Spiel
                actionCell.appendChild(b2);
            }

            listTable.appendChild(row);
        });

        contentContainer.appendChild(listTable);
    };

    console.log("Modul Gewächshaus mit Buttons bereit.");
})();