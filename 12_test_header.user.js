// ==UserScript==
// @name         12_Test_Header
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Erstellt Test-Buttons im Header
// @author       Peter&Gemini
// @match        https://game.logistics-empire.com/*
// @resource     iconArbeitsplatz https://raw.githubusercontent.com/Guldukan/Github-Logistik-Empire/refs/heads/main/ico/arbeitzplatz.ico?token=GHSAT0AAAAAADVKU7U5MGPMZYVZQW57T6EW2NIUEYQ
// @grant        GM_getResourceURL
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper-Funktion zum Erstellen der Icon-Buttons im Stil der Navigationsleiste ---
    function createNativeHeaderButton(id, iconUrl, tooltip) {
        // Haupt-Wrapper für einen Button + Trennlinie
        const wrapper = document.createElement('div');
        // Wir verwenden die Klassen, die das Spiel für seine eigenen Button-Gruppen nutzt
        wrapper.className = 'flex shrink-0 items-center gap-4 not-first:pl-4';

        // Relativer Container für das Bild selbst
        const imageContainer = document.createElement('div');
        imageContainer.className = 'relative';

        // Das klickbare Icon-Bild
        const icon = document.createElement('img');
        icon.id = id;
        icon.src = iconUrl;
        icon.title = tooltip;
        // Wir verwenden die Klassen der originalen Icons für ein natives Aussehen
        icon.className = 'img image-shadow size-16 object-contain transition-transform duration-150';
        icon.style.cursor = 'pointer'; // Zeigt an, dass es klickbar ist

        // Hover-Effekt für besseres Feedback
        icon.onmouseover = () => icon.style.transform = 'scale(1.1)';
        icon.onmouseout = () => icon.style.transform = 'scale(1)';

        // Die Trennlinie rechts vom Button
        const separator = document.createElement('div');
        separator.className = 'my-4 h-4/5 border-r-4';

        // Alles zusammenbauen
        imageContainer.appendChild(icon);
        wrapper.appendChild(imageContainer);
        wrapper.appendChild(separator);

        return wrapper;
    }

    function addButtons() {
        // Finde den Ziel-Container in der Navigationsleiste anhand des data-Attributes
        const targetContainer = document.querySelector('[data-tutorial-id="navigation-right-section"]');

        // Wenn der Container nicht da ist oder unsere Buttons schon existieren, nichts tun
        if (!targetContainer || document.getElementById('pg-activate-button')) return;

        // Füge einen Trenner zum letzten vorhandenen Button hinzu, falls dieser fehlt (beim "Settings"-Button der Fall)
        const lastButtonWrapper = targetContainer.lastElementChild;
        if (lastButtonWrapper && !lastButtonWrapper.querySelector('.border-r-4')) {
            const separator = document.createElement('div');
            separator.className = 'my-4 h-4/5 border-r-4';
            lastButtonWrapper.appendChild(separator);
        }

        // Die beiden Buttons mit der neuen Funktion erstellen
        const activateButton = createNativeHeaderButton('pg-activate-button', GM_getResourceURL('iconArbeitsplatz'), 'Aktivieren');
        const newButton = createNativeHeaderButton('pg-new-button', 'https://game.logistics-empire.com/assets/res_tomatoes-DB5E8JLB.avif', 'Neuer Button');

        // Beide Buttons zum Container hinzufügen
        targetContainer.appendChild(activateButton);
        targetContainer.appendChild(newButton);
    }

    // Prüfe jede Sekunde (1000ms), ob die Buttons noch da sind, und erstelle sie neu falls nötig
    setInterval(addButtons, 1000);
})();