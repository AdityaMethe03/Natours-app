// const locations = JSON.parse(document.getElementById('map').dataset.locations);

export const displayMap = locations => {
    var map = L.map('map', {
        zoomControl: false,
        zoomAnimation: true,  // Enable smooth zoom animation
        zoomAnimationThreshold: 4
    });

    // // Example with a hypothetical pencil sketch style
    // L.tileLayer('https://{s}.tile.pencilmap.com/{z}/{x}/{y}.png', {
    //     attribution: 'Funny maps by <a href="https://pencilmap.com">PencilMap</a>',
    // }).addTo(map);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const points = [];
    locations.forEach((loc) => {
        points.push([loc.coordinates[1], loc.coordinates[0]]);
        L.marker([loc.coordinates[1], loc.coordinates[0]])
            .addTo(map)
            .bindPopup(`<h1>${loc.description}</h1>`, { autoClose: false })
            .openPopup();
    });

    const bounds = L.latLngBounds(points).pad(0.5);
    map.fitBounds(bounds);

    map.scrollWheelZoom.disable();

    // Add zoom functionality using keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === '+') {
            map.zoomIn();
        } else if (event.key === '-') {
            map.zoomOut();
        }
    });
}

//follow lecture 191 also