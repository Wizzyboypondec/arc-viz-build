<!-- Map Controller Component -->
<script type="module">
  import CONFIG from '../../js/config.js';
  import { renderSoilDataPanel } from '../map/SoilDataPanel.js';

  // Global variables
  let map = null;
  let drawnItems = null;
  let currentPolygon = null;
  let areaValueElement = null;
  let coordsCountElement = null;
  let soilStatusElement = null;

  export async function initializeMap() {
    // Wait for Leaflet to be loaded
    await waitForLeaflet();
    
    // Create the map container and append it to the DOM
    const app = document.getElementById('app') || document.body;
    const mapContainer = renderMapContainer();
    app.appendChild(mapContainer);
    
    // Get elements for updates
    areaValueElement = document.getElementById('area-value');
    coordsCountElement = document.getElementById('coords-count');
    soilStatusElement = document.getElementById('soil-status');
    
    // Initialize Leaflet map
    map = L.map('map', {
      center: CONFIG.MAP.defaultCenter,
      zoom: CONFIG.MAP.defaultZoom,
      maxZoom: CONFIG.MAP.maxZoom
    });
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Initialize feature group for drawing
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    
    // Initialize Draw Control
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      }
    });
    map.addControl(drawControl);
    
    // Event listeners
    setupEventListeners();
    
    // Setup search functionality
    setupLocationSearch();
    
    // Setup current location button
    setupCurrentLocation();
    
    return map;
  }

  function waitForLeaflet() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof L !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  function setupEventListeners() {
    // Listen for when a shape is created
    map.on(L.Draw.Event.CREATED, function(event) {
      const layer = event.layer;
      const type = event.layerType;
      
      // Clear previous drawings
      drawnItems.clearLayers();
      
      // Add the new layer
      drawnItems.addLayer(layer);
      
      // Handle polygon creation
      if (type === 'polygon') {
        currentPolygon = layer;
        calculateArea(layer);
        fetchSoilData(layer);
      }
    });
    
    // Listen for when a shape is edited
    map.on(L.Draw.Event.EDITED, function(event) {
      const layers = event.layers;
      layers.eachLayer(function(layer) {
        if (layer instanceof L.Polygon) {
          calculateArea(layer);
          fetchSoilData(layer);
        }
      });
    });
    
    // Listen for when a shape is deleted
    map.on(L.Draw.Event.DELETED, function() {
      resetAreaDisplay();
      resetSoilData();
    });
  }

  function calculateArea(polygon) {
    // Use Turf.js to calculate area
    const geoJson = polygon.toGeoJSON();
    const area = turf.area(geoJson);
    
    // Update display
    areaValueElement.textContent = formatArea(area);
    coordsCountElement.textContent = geoJson.geometry.coordinates[0].length - 1; // Subtract 1 because first and last points are the same
    
    // Dispatch custom event with area data
    document.dispatchEvent(new CustomEvent('area-calculated', {
      detail: {
        area: area,
        geoJson: geoJson
      }
    }));
  }

  function formatArea(area) {
    if (area < 1000) {
      return `${Math.round(area)} m²`;
    } else {
      return `${(area / 1000).toFixed(2)} km²`;
    }
  }

  function resetAreaDisplay() {
    areaValueElement.textContent = '0 m²';
    coordsCountElement.textContent = '0';
    currentPolygon = null;
  }

  async function setupLocationSearch() {
    const searchInput = document.getElementById('location-search');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  async function performSearch() {
    const query = document.getElementById('location-search').value.trim();
    if (!query) return;
    
    try {
      // Use Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&country=NG`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        // Pan to location
        map.setView([lat, lon], 15);
        
        // Add marker
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${query}</b><br>${data[0].display_name}`)
          .openPopup();
          
        // Dispatch event with location data
        document.dispatchEvent(new CustomEvent('location-found', {
          detail: { lat, lon, name: query }
        }));
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for location. Please try again.');
    }
  }

  function setupCurrentLocation() {
    const locationBtn = document.getElementById('current-location');
    
    locationBtn.addEventListener('click', async () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }
      
      locationBtn.disabled = true;
      locationBtn.innerHTML = '<span class="loading"></span> Getting Location...';
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Pan to current location
          map.setView([latitude, longitude], 15);
          
          // Add marker
          L.marker([latitude, longitude]).addTo(map)
            .bindPopup('<b>Your Location</b>')
            .openPopup();
            
          // Dispatch event with location data
          document.dispatchEvent(new CustomEvent('current-location-found', {
            detail: { lat: latitude, lon: longitude }
          }));
          
          locationBtn.disabled = false;
          locationBtn.innerHTML = `\n            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />\n            </svg>\n            <span class="text-sm">Current Location</span>\n          `;
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Error getting your location. Please make sure location services are enabled.');
          
          locationBtn.disabled = false;
          locationBtn.innerHTML = `\n            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />\n            </svg>\n            <span class="text-sm">Current Location</span>\n          `;
        }
      );
    });
  }

  async function fetchSoilData(polygon) {
    soilStatusElement.textContent = 'Fetching...';
    
    try {
      // Get polygon coordinates
      const geoJson = polygon.toGeoJSON();
      const coordinates = geoJson.geometry.coordinates[0];
      
      // Calculate centroid for sampling point
      const centroid = turf.centroid(geoJson);
      const lat = centroid.geometry.coordinates[1];
      const lon = centroid.geometry.coordinates[0];
      
      // In a real implementation, this would call Google Earth Engine API
      // For now, we'll simulate the response
      setTimeout(() => {
        soilStatusElement.textContent = 'Available';
        
        // Dispatch event with simulated soil data
        document.dispatchEvent(new CustomEvent('soil-data-received', {
          detail: {
            coordinates: { lat, lon },
            data: {
              soil_type: 'Loamy Soil',
              ph_level: 6.5,
              organic_matter: 'Medium',
              drainage: 'Good',
              suitability: 'High',
              recommendations: 'Suitable for most crops. Consider adding compost for optimal results.'
            }
          }
        }));
        
        // Render soil data panel
        const soilPanel = renderSoilDataPanel();
        const existingPanel = document.getElementById('soil-data-panel');
        if (existingPanel) {
          existingPanel.remove();
        }
        document.body.appendChild(soilPanel);
        
      }, 1500);
      
    } catch (error) {
      console.error('Error fetching soil data:', error);
      soilStatusElement.textContent = 'Error';
    }
  }

  function resetSoilData() {
    soilStatusElement.textContent = '-';
    const soilPanel = document.getElementById('soil-data-panel');
    if (soilPanel) {
      soilPanel.remove();
    }
  }

  // Export functions
  export {
    initializeMap,
    calculateArea,
    fetchSoilData,
    resetSoilData
  };
</script>