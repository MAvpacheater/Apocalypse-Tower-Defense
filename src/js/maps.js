// src/js/maps.js - Maps Gallery Functionality

let maps = [];
let currentMapIndex = 0;

// Initialize maps page
document.addEventListener('DOMContentLoaded', async () => {
    await loadMapsFromJSON();
    renderMaps();
    setupNavigation();
    setupFullscreen();
    setupKeyboardNavigation();
    logInitialization();
});

// Load maps from JSON file
async function loadMapsFromJSON() {
    try {
        const response = await fetch('../res/maps.json');
        if (!response.ok) {
            throw new Error('Failed to load maps.json');
        }
        const data = await response.json();
        maps = data.maps || [];
    } catch (error) {
        console.error('Error loading maps:', error);
        maps = [];
    }
}

// Render maps
function renderMaps() {
    if (maps.length === 0) {
        renderEmptyState();
        return;
    }

    renderMapViewer();
    renderThumbnails();
    updateMapInfo();
    updateCounter();
}

// Render empty state
function renderEmptyState() {
    const container = document.getElementById('mapContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="maps-empty">
            <div class="maps-empty-icon">🗺️</div>
            <p class="maps-empty-text">No maps available yet</p>
        </div>
    `;
}

// Render map viewer
function renderMapViewer() {
    const container = document.getElementById('mapContainer');
    if (!container) return;

    container.innerHTML = maps.map((map, index) => `
        <div class="map-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${map.image}" alt="${map.name}" loading="lazy">
        </div>
    `).join('');
}

// Render thumbnails
function renderThumbnails() {
    const thumbnailsContainer = document.getElementById('mapThumbnails');
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = maps.map((map, index) => `
        <div class="map-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${map.image}" alt="${map.name}" loading="lazy">
            <div class="map-thumbnail-overlay">${map.name}</div>
        </div>
    `).join('');

    // Add click handlers
    const thumbnails = thumbnailsContainer.querySelectorAll('.map-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            goToMap(index);
        });
    });
}

// Setup navigation
function setupNavigation() {
    const prevBtn = document.getElementById('mapPrev');
    const nextBtn = document.getElementById('mapNext');

    prevBtn?.addEventListener('click', () => previousMap());
    nextBtn?.addEventListener('click', () => nextMap());
}

// Setup fullscreen
function setupFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const fullscreenModal = document.getElementById('fullscreenModal');
    const fullscreenClose = document.getElementById('fullscreenClose');
    const fullscreenPrev = document.getElementById('fullscreenPrev');
    const fullscreenNext = document.getElementById('fullscreenNext');
    const fullscreenImage = document.getElementById('fullscreenImage');

    fullscreenBtn?.addEventListener('click', () => {
        if (maps.length > 0) {
            fullscreenImage.src = maps[currentMapIndex].image;
            fullscreenImage.alt = maps[currentMapIndex].name;
            fullscreenModal?.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    fullscreenClose?.addEventListener('click', closeFullscreen);
    fullscreenModal?.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) {
            closeFullscreen();
        }
    });

    fullscreenPrev?.addEventListener('click', () => {
        previousMap();
        updateFullscreenImage();
    });

    fullscreenNext?.addEventListener('click', () => {
        nextMap();
        updateFullscreenImage();
    });
}

// Close fullscreen
function closeFullscreen() {
    const fullscreenModal = document.getElementById('fullscreenModal');
    fullscreenModal?.classList.remove('active');
    document.body.style.overflow = '';
}

// Update fullscreen image
function updateFullscreenImage() {
    const fullscreenImage = document.getElementById('fullscreenImage');
    if (fullscreenImage && maps.length > 0) {
        fullscreenImage.src = maps[currentMapIndex].image;
        fullscreenImage.alt = maps[currentMapIndex].name;
    }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const fullscreenModal = document.getElementById('fullscreenModal');
        const isFullscreen = fullscreenModal?.classList.contains('active');

        if (e.key === 'Escape' && isFullscreen) {
            closeFullscreen();
        } else if (e.key === 'ArrowLeft') {
            previousMap();
            if (isFullscreen) updateFullscreenImage();
        } else if (e.key === 'ArrowRight') {
            nextMap();
            if (isFullscreen) updateFullscreenImage();
        }
    });
}

// Navigate to specific map
function goToMap(index) {
    if (index < 0 || index >= maps.length) return;

    // Update slides
    const slides = document.querySelectorAll('.map-slide');
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    // Update thumbnails
    const thumbnails = document.querySelectorAll('.map-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    currentMapIndex = index;
    updateMapInfo();
    updateCounter();
}

// Previous map
function previousMap() {
    const newIndex = (currentMapIndex - 1 + maps.length) % maps.length;
    goToMap(newIndex);
}

// Next map
function nextMap() {
    const newIndex = (currentMapIndex + 1) % maps.length;
    goToMap(newIndex);
}

// Update map info
function updateMapInfo() {
    const mapInfo = document.getElementById('mapInfo');
    if (!mapInfo || maps.length === 0) return;

    const currentMap = maps[currentMapIndex];
    const mapName = mapInfo.querySelector('.map-name');
    const mapDescription = mapInfo.querySelector('.map-description');

    if (mapName) mapName.textContent = currentMap.name;
    if (mapDescription) mapDescription.textContent = currentMap.description;
}

// Update counter
function updateCounter() {
    const counter = document.getElementById('mapCounter');
    if (!counter) return;

    const current = counter.querySelector('.current');
    const total = counter.querySelector('.total');

    if (current) current.textContent = currentMapIndex + 1;
    if (total) total.textContent = maps.length;
}

// Log initialization
function logInitialization() {
    console.log('%c🗺️ Maps Page Loaded', 'color: #22c55e; font-size: 14px; font-weight: bold;');
    console.log(`%cTotal maps: ${maps.length}`, 'color: #9ca3af;');
}

// Auto-slide (optional)
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextMap();
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Export for external use
window.mapsManager = {
    maps,
    currentMapIndex,
    goToMap,
    previousMap,
    nextMap,
    startAutoSlide,
    stopAutoSlide
};
