// ==UserScript==
// @name         03_Ausblenden
// @namespace    Ausblenden
// @version      1.0
// @description  Funktion zum Ausblenden von Schneider-Markern.
// @author       PB@G Flöha-Logistik
// @match        https://game.logistics-empire.com/*
// @grant        none
// ==/UserScript==
/* eslint-disable no-multi-spaces *//**
 * Sucht alle Schneider-Marker und blendet sie aus
 */
function hideTailorBuildings() {
    const markers = document.querySelectorAll('.maplibregl-marker');

    markers.forEach(marker => {
        // Prüfen, ob das spezifische Schneider-Icon vorhanden ist
        if (marker.querySelector('img[src*="icon_bld_tailor"]')) {
            marker.style.display = 'none'; 
            // Alternativ: marker.remove(); // Löscht es komplett
        }
    });
}

// Ausführen
hideTailorBuildings();