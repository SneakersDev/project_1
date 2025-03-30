import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Clave de acceso de Mapbox desde variables de entorno
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Mapa = ({
  coordenadas,            // Coordenadas seleccionadas manualmente (usadas en formularios)
  onCoordenadasChange,    // Función que se llama cuando se hace clic o búsqueda en el mapa
  ubicaciones = [],       // Lista de ubicaciones [GeoJSON] (cliente + sedes)
  iconos = [],            // Lista de íconos ['🏢', '📍', ...] correspondiente a cada ubicación
  nombres = [],           // Lista de nombres para mostrar en los tooltips
  viewport,               // Estado de centro/zoom del mapa
  setViewport             // Función para actualizar viewport
}) => {
  const mapContainer = useRef(null);       // Referencia al div del mapa
  const mapRef = useRef(null);             // Referencia al mapa Mapbox
  const markerRef = useRef(null);          // Marcador único para edición
  const multipleMarkers = useRef([]);      // Marcadores múltiples para ver cliente + sedes

  // Inicializar mapa solo una vez
  useEffect(() => {
    if (mapRef.current) return;

    // Crear instancia del mapa
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordenadas
        ? [coordenadas.lng, coordenadas.lat]
        : [viewport?.longitude || -74.06, viewport?.latitude || 4.65],
      zoom: viewport?.zoom || 11,
    });

    // Permitir sincronizar viewport con el estado externo
    if (setViewport) {
      mapRef.current.on('moveend', () => {
        const center = mapRef.current.getCenter();
        setViewport({
          latitude: center.lat,
          longitude: center.lng,
          zoom: mapRef.current.getZoom()
        });
      });
    }

    // Agregar buscador Mapbox Geocoder
       const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Buscar ubicación en Colombia..",
      countries: "co",
      language: "es",
      proximity: { longitude: -74.1, latitude: 4.7 }, // Bogotá
      types: "address,place,poi",
      zoom: 14,
      marker: { color: 'blue' },
      limit: 10
    });



   


    mapRef.current.addControl(geocoder, 'top-left');

    // Cuando se elige una ubicación desde el buscador
    geocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates;
      if (onCoordenadasChange) {
        onCoordenadasChange({ lng: coords[0], lat: coords[1] });
      }
      updateSingleMarker(coords); // Mostrar el marcador único
    });

    // Cuando se hace clic en el mapa
    mapRef.current.on('click', (e) => {
      const coords = [e.lngLat.lng, e.lngLat.lat];
      if (onCoordenadasChange) {
        onCoordenadasChange({ lng: coords[0], lat: coords[1] });
      }
      updateSingleMarker(coords); // Mostrar el marcador único
    });
  }, []);

  // 📌 Actualiza el marcador único (modo creación/edición)
  const updateSingleMarker = (coords) => {
    if (markerRef.current) {
      markerRef.current.setLngLat(coords);
    } else {
      markerRef.current = new mapboxgl.Marker().setLngLat(coords).addTo(mapRef.current);
    }
    mapRef.current.flyTo({ center: coords });
  };

  // 📍 Dibuja múltiples marcadores para visualización de cliente y sedes
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores anteriores
    multipleMarkers.current.forEach(marker => marker.remove());
    multipleMarkers.current = [];

    ubicaciones.forEach((ubi, index) => {
      const coords = ubi.coordinates || [];
      if (coords.length === 2) {
        const nombre = nombres[index] || 'Ubicación';
        const icono = iconos[index] || '📍';

        // Asignar color según tipo
        const color = icono === '🏢' ? 'blue' : 'red';

        // Crear elemento visual para el ícono personalizado
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerText = icono;
        el.style.fontSize = '24px';

        // Crear y añadir marcador
        const marker = new mapboxgl.Marker({ element: el, color })
          .setLngLat(coords)
          .setPopup(new mapboxgl.Popup().setText(nombre))
          .addTo(mapRef.current);

        multipleMarkers.current.push(marker);
      }
    });
  }, [ubicaciones, iconos, nombres]);

  // Render del contenedor del mapa
  return (
    <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
  );
};

export default Mapa;
