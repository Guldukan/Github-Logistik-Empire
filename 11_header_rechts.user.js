// ==UserScript==
// @name         11_Test_Header
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Platziert Status-Anzeigen in der Ressourcen-Bar nach den Superbucks
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

   // Konfiguration der 5 Status-Slots
    const statusConfig = [
        { id: 'muehle',   icon: '🏭' },
        { id: 'status_2', icon: '📊' },
        { id: 'status_3', icon: '⚡' },
        { id: 'status_4', icon: '📦' },
        { id: 'status_5', icon: '🔥' }
    ];

    /**
     * Globale Funktion zum Aktualisieren der Werte von außen
     * Beispiel: window.updateStatus('muehle', 'Voll', 100, 'alert');
     * statusType: 'ok', 'warn', 'alert' oder null (für Standardfarbe)
     */
    window.updateStatus = function(id, text, percent, statusType = null) {
        const textEl = document.getElementById(`value-${id}`);
        const barEl = document.getElementById(`bar-${id}`);

        if (textEl) textEl.textContent = text;
        if (barEl) {
            barEl.style.width = percent + '%';
            
            // Alte Status-Klassen entfernen
            barEl.classList.remove('pg-status-ok', 'pg-status-warn', 'pg-status-alert');
            
            // Neue Klasse setzen, falls vorhanden
            if (statusType) {
                barEl.classList.add(`pg-status-${statusType}`);
            }
        }
    };

    /**
     * Erstellt das HTML für eine Anzeige
     */
    function createStatusElement(config) {
        const wrapper = document.createElement('div');
        // Styles kommen aus der zentralen CSS-Datei (pg-status-item)
        wrapper.className = 'pg-status-item';
        wrapper.setAttribute('data-pg-status-id', config.id);

        wrapper.innerHTML = `
            <div class="separator"></div>
            <div class="container">
                <div class="icon">${config.icon || '❓'}</div>
                <span id="value-${config.id}" class="value-text">${config.id === 'muehle' ? 'Suche...' : '0%'}</span>
                <div class="bar-background">
                    <!-- Hier wird nun eine CSS-Klasse für die Farbe genutzt -->
                    <div id="bar-${config.id}" class="bar-foreground pg-color-${config.id}" style="width: 0%;"></div>
                </div>
            </div>
        `;
        return wrapper;
    }

    // Hauptfunktion zum Einbetten
    function inject() {
        // Ziel: Die Ressourcen-Bar
        const targetBar = document.querySelector('[data-tutorial-id="main-top-bar"]');
        
        if (targetBar) {
           statusConfig.forEach(config => {
                // Falls das Element existiert (z.B. weil das Spiel neu gezeichnet hat), prüfen wir, ob wir es neu anhängen müssen
                
                // Prüfen, ob dieser spezifische Button schon existiert
                if (!document.querySelector(`[data-pg-status-id="${config.id}"]`)) {
                    const el = createStatusElement(config);
                    
                    // appendChild fügt es ganz am Ende der Bar ein
                    // Das ist automatisch nach den Superbucks (4,7k)
                    targetBar.appendChild(el);
                }
            });
        }
    }

    // Regelmäßige Prüfung (Game Loop für UI)
    setInterval(inject, 1000);

    /**
     * STRATEGIE 1: Sucht nach der Detail-Ansicht "Produktionslinie" für exakte Werte.
     * @returns {boolean} - true, wenn die Ansicht gefunden und verarbeitet wurde.
     */
    function scanDetailedView() {
        const prodLinePanel = Array.from(document.querySelectorAll('.action-panel'))
                                   .find(p => p.textContent.includes('Produktionslinie'));

        if (!prodLinePanel) return false;

        // 1. Status Text holen
        const statusLabel = prodLinePanel.querySelector('.bb-label-container');
        const statusText = statusLabel ? statusLabel.textContent.trim() : 'Läuft';

        // 2. Status-Typ bestimmen (für CSS Klasse)
        let statusType = 'ok';
        if (statusLabel) {
            if (statusLabel.classList.contains('variant--warning')) statusType = 'warn';
            if (statusLabel.classList.contains('variant--alert'))   statusType = 'alert';
        }

        // 3. Echten Füllstand berechnen
        let percent = 0;
        const numbers = Array.from(prodLinePanel.querySelectorAll('number-flow-vue'));
        const maxEl = numbers.find(n => n.getAttribute('aria-label')?.includes('/'));
        
        if (maxEl && maxEl.previousElementSibling) {
            const current = window.PG_CONFIG.parseKValue(maxEl.previousElementSibling.getAttribute('aria-label'));
            const max = window.PG_CONFIG.parseKValue(maxEl.getAttribute('aria-label'));
            if (max > 0) percent = (current / max) * 100;
        } else if (statusText === 'Läuft') {
            percent = 100; // Wenn alles läuft, aber keine Zahlen da sind, ist es wohl voll.
        }

        // Text kürzen und updaten
        const shortText = statusText.replace('Mehr Waren für Abschluss benötigt', 'Waren fehlen')
                                  .replace('Produktionsausgang', 'Ausg.');
        
        window.updateStatus('muehle', shortText, Math.round(percent), statusType);
        return true;
    }

    /**
     * STRATEGIE 2: Sucht nach der Mühle in der Gebäude-Liste (weniger genaue Werte).
     * @returns {boolean} - true, wenn die Ansicht gefunden und verarbeitet wurde.
     */
    function scanListView() {
        const millTitle = Array.from(document.querySelectorAll('.text-h2'))
                               .find(el => el.textContent.trim() === 'Mühle');

        if (!millTitle) return false;

        const cardContainer = millTitle.parentElement;
        const statusLabel = cardContainer ? cardContainer.querySelector('.bb-label-container') : null;

        if (statusLabel) {
            const text = statusLabel.textContent.trim();
            let statusType = 'warn'; // Standardannahme in der Liste: Warnung wenn sichtbar
            let percent = 100;

            if (statusLabel.classList.contains('variant--alert')) {
                statusType = 'alert';
            }

            if (text.includes('Voll')) percent = 100;
            if (text.includes('Leer')) percent = 0;

            const shortText = text.replace('Produktionsausgang', 'Ausg.').replace('Eingangslager', 'Eing.');
            window.updateStatus('muehle', shortText, percent, statusType);
        } else {
            // Kein Status-Label -> alles OK
            window.updateStatus('muehle', 'Läuft', 100, 'ok');
        }
        return true;
    }

    /**
     * Setzt den Status zurück, wenn nichts gefunden wird.
     */
    function resetMillStatus() {
        const textEl = document.getElementById('value-muehle');
        if (textEl && textEl.textContent !== 'Suche...') {
            // null als Status setzt es auf die Standardfarbe (Blau für Mühle) zurück
            window.updateStatus('muehle', 'Suche...', 0, null);
        }
    }

    // Haupt-Scanner-Schleife
    setInterval(() => {
        // Priorität 1: Detailansicht (genau)
        if (scanDetailedView()) {
            return;
        }
        // Priorität 2: Listenansicht (Schätzung)
        if (scanListView()) {
            return;
        }
        // Ansonsten: Zurücksetzen
        resetMillStatus();
    }, 1000);

})();
