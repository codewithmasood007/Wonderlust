// js/map.js
const initMap = () => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // If coordinates are [0,0] or missing, show a message instead of a broken map
    if (!listingCoordinates || (listingCoordinates[0] === 0 && listingCoordinates[1] === 0)) {
        mapElement.innerHTML = "<div class='text-center p-5'><h5>Location map not available for this listing.</h5><p>Coordinates were not found.</p></div>";
        return;
    }

    // Initialize Map
    const map = L.map('map').setView([listingCoordinates[1], listingCoordinates[0]], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    L.marker([listingCoordinates[1], listingCoordinates[0]])
        .addTo(map)
        .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
        .openPopup();
};

window.addEventListener('DOMContentLoaded', initMap);