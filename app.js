// Datos de las cafeterías
const cafeterias = [
    {
        nombre: "Toma Café 1",
        direccion: "Calle de la Palma 49",
        barrio: "Malasaña",
        latitud: 40.4253,
        longitud: -3.7027,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€"
    },
    {
        nombre: "Toma Café 2",
        direccion: "Calle de Santa Feliciana 5",
        barrio: "Chamberí",
        latitud: 40.4310,
        longitud: -3.7088,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€"
    },
    {
        nombre: "Toma Café Olavide",
        direccion: "Calle Olavide",
        barrio: "Chamberí",
        latitud: 40.4319,
        longitud: -3.7095,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€"
    },
    {
        nombre: "La Bicicleta Café - San Ildefonso",
        direccion: "Plaza de San Ildefonso 9",
        barrio: "Malasaña",
        latitud: 40.4234,
        longitud: -3.7025,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€€"
    },
    {
        nombre: "La Bicicleta Café - Galileo",
        direccion: "Calle Galileo",
        barrio: "Chamberí",
        latitud: 40.4288,
        longitud: -3.7123,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€€"
    },
    {
        nombre: "Federal Café Comendadoras",
        direccion: "Plaza de las Comendadoras 9",
        barrio: "Conde Duque",
        latitud: 40.4275,
        longitud: -3.7108,
        tipo_propiedad: "Cadena mediana",
        rango_precio: "€€"
    },
    {
        nombre: "Federal Café Conde de Barajas",
        direccion: "Plaza del Conde de Barajas 3",
        barrio: "La Latina",
        latitud: 40.4138,
        longitud: -3.7073,
        tipo_propiedad: "Cadena mediana",
        rango_precio: "€€"
    },
    {
        nombre: "HanSo Café - Pez",
        direccion: "Calle del Pez 20",
        barrio: "Malasaña",
        latitud: 40.4243,
        longitud: -3.7038,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€€-€€€"
    },
    {
        nombre: "HanSo Café 2 - Ángeles",
        direccion: "Costanilla de los Ángeles 7",
        barrio: "Centro",
        latitud: 40.4187,
        longitud: -3.7067,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€€-€€€"
    },
    {
        nombre: "Misión Café",
        direccion: "Calle de los Reyes 5",
        barrio: "Noviciado/Centro",
        latitud: 40.4251,
        longitud: -3.7110,
        tipo_propiedad: "Independiente",
        rango_precio: "€€"
    },
    {
        nombre: "Ruda Café",
        direccion: "Calle de la Ruda 11",
        barrio: "La Latina",
        latitud: 40.4109,
        longitud: -3.7086,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€"
    },
    {
        nombre: "Ruda Café 2.0",
        direccion: "Calle de Calatrava 26",
        barrio: "La Latina",
        latitud: 40.4115,
        longitud: -3.7091,
        tipo_propiedad: "Cadena pequeña",
        rango_precio: "€€"
    },
    {
        nombre: "Obrar",
        direccion: "Calle de Galileo 9",
        barrio: "Chamberí",
        latitud: 40.4288,
        longitud: -3.7123,
        tipo_propiedad: "Independiente",
        rango_precio: "€€"
    },
    {
        nombre: "Bianchi Kiosko Caffé",
        direccion: "Calle San Joaquín 9",
        barrio: "Chueca",
        latitud: 40.4265,
        longitud: -3.6958,
        tipo_propiedad: "Independiente",
        rango_precio: "€"
    }
];

// Variables globales
let map;
let markersLayer;
let filteredData = [...cafeterias];
let barrioFilters = [];

// Función para obtener el color del marcador según el precio
function getMarkerColor(precio) {
    switch(precio) {
        case '€':
            return '#27ae60'; // Verde
        case '€€':
            return '#ff6348'; // Naranja
        case '€€-€€€':
            return '#ff4757'; // Rojo
        default:
            return '#ff6348';
    }
}

// Función para crear el contenido del popup
function createPopupContent(cafe) {
    return `
        <div class="popup-content">
            <h4>⚠️ ${cafe.nombre}</h4>
            <div class="popup-info">
                <strong>📍</strong> ${cafe.direccion}<br>
                <strong>🏘️</strong> ${cafe.barrio}
            </div>
            <div class="popup-tags">
                <span class="popup-tag tipo">${cafe.tipo_propiedad}</span>
                <span class="popup-tag precio">${cafe.rango_precio}</span>
            </div>
        </div>
    `;
}

// Inicializar el mapa
function initMap() {
    // Crear el mapa centrado en Madrid
    map = L.map('map').setView([40.42, -3.70], 13);
    
    // Añadir tile layer con tema oscuro
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Crear grupo de marcadores con clustering
    markersLayer = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50
    });
    
    // Añadir marcadores al mapa
    updateMarkers();
    
    map.addLayer(markersLayer);
}

// Función para actualizar los marcadores en el mapa
function updateMarkers() {
    markersLayer.clearLayers();
    
    filteredData.forEach(cafe => {
        const color = getMarkerColor(cafe.rango_precio);
        
        // Crear icono personalizado
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: white;
                font-weight: bold;
            ">☕</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Crear marcador
        const marker = L.marker([cafe.latitud, cafe.longitud], { icon: customIcon })
            .bindPopup(createPopupContent(cafe));
        
        markersLayer.addLayer(marker);
    });
    
    // Actualizar contador
    updateStats();
}

// Función para generar filtros de barrios dinámicamente
function generateBarrioFilters() {
    const barrios = [...new Set(cafeterias.map(cafe => cafe.barrio))].sort();
    const barrioContainer = document.getElementById('barrio-filters');
    
    barrios.forEach(barrio => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${barrio}" class="barrio-filter" checked>
            ${barrio}
        `;
        barrioContainer.appendChild(label);
    });
    
    // Añadir event listeners
    document.querySelectorAll('.barrio-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

// Función para aplicar filtros
function applyFilters() {
    const barrioFilters = Array.from(document.querySelectorAll('.barrio-filter:checked')).map(cb => cb.value);
    const tipoFilters = Array.from(document.querySelectorAll('.tipo-filter:checked')).map(cb => cb.value);
    const precioFilters = Array.from(document.querySelectorAll('.precio-filter:checked')).map(cb => cb.value);
    
    filteredData = cafeterias.filter(cafe => {
        return barrioFilters.includes(cafe.barrio) &&
               tipoFilters.includes(cafe.tipo_propiedad) &&
               precioFilters.includes(cafe.rango_precio);
    });
    
    updateMarkers();
}

// Función para resetear filtros
function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    applyFilters();
}

// Función para actualizar estadísticas
function updateStats() {
    document.getElementById('total-cafes').textContent = filteredData.length;
}

// Función para expandir/contraer análisis
function toggleAnalysis() {
    const expandedContent = document.getElementById('expanded-analysis');
    const expandBtn = document.getElementById('expand-btn');
    
    if (expandedContent.classList.contains('show')) {
        expandedContent.classList.remove('show');
        expandBtn.textContent = 'Ver análisis completo';
    } else {
        expandedContent.classList.add('show');
        expandBtn.textContent = 'Ocultar análisis';
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    initMap();
    
    // Generar filtros de barrios
    generateBarrioFilters();
    
    // Añadir event listeners para filtros
    document.querySelectorAll('.tipo-filter, .precio-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Actualizar estadísticas iniciales
    updateStats();
});