import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import api from '../api/api';
import Mapa from '../components/Mapa'; // Componente reutilizable para visualizar coordenadas
import toast from 'react-hot-toast';

const VerMapa = () => {
  // Lista de sneakers disponibles para seleccionar
  const [sneakers, setSneakers] = useState([]);

  // ID del sneaker actualmente seleccionado
  const [sneakerId, setSneakerId] = useState(null);

  // Sneaker completo cargado desde el backend
  const [sneakerSeleccionado, setSneakerSeleccionado] = useState(null);

  // Lista de ubicaciones a mostrar en el mapa (cliente y sus sedes)
  const [ubicaciones, setUbicaciones] = useState([]);

  // Íconos personalizados para cada ubicación (🏢 cliente, 📍 sede)
  const [iconos, setIconos] = useState([]);

  // Nombres para mostrar como tooltip de cada marcador
  const [nombres, setNombres] = useState([]);

  // Posición y zoom del visor del mapa (centro inicial)
  const [viewport, setViewport] = useState({
    latitude: 4.65,
    longitude: -74.06,
    zoom: 11
  });

  // Al iniciar el componente, obtener la lista de clientes
  useEffect(() => {
    api.get('/sneakers')
      .then(res => setSneakers(res.data))
      .catch(err => toast.error('Error cargando clientes'));
  }, []);

  // Función que se ejecuta al presionar "Cargar en el Mapa"
  const cargarSneaker = async () => {
    if (!sneakerId) return toast.error('Selecciona un sneaker');

    try {
      const res = await api.get(`/sneakers/${sneakerId}`);
      const sneaker = res.data;
      setSneakerSeleccionado(sneaker);

      const ubicacionesTemp = [];
      const iconosTemp = [];
      const nombresTemp = [];

      // Agregar ubicación del sneaker
      if (sneaker.ubicacion?.coordinates) {
        ubicacionesTemp.push(sneaker.ubicacion);        // Coordenadas GeoJSON
        iconosTemp.push('🏢');                           // Ícono azul para sneaker
        nombresTemp.push(sneaker.nombre);          // Nombre para tooltip

        // Recentrar el mapa en el sneaker
        setViewport({
          latitude: sneaker.ubicacion.coordinates[1],
          longitude: sneaker.ubicacion.coordinates[0],
          zoom: 13
        });
      }

      // Agregar sedes del sneaker
      if (Array.isArray(sneaker.sedes)) {
        sneaker.sedes.forEach(sede => {
          if (sede.ubicacion?.coordinates) {
            ubicacionesTemp.push(sede.ubicacion);        // Coordenadas GeoJSON
            iconosTemp.push('📍');                       // Ícono rojo para sede
            nombresTemp.push(sede.nombre);               // Nombre para tooltip
          }
        });
      }

      // Actualizar los estados del componente
      setUbicaciones(ubicacionesTemp);
      setIconos(iconosTemp);
      setNombres(nombresTemp);

    } catch (err) {
      toast.error('Error al cargar sneaker');
    }
  };

  return (
    <Container>
      <h2 className="mt-4 mb-3">Ver Sneaker y tiendas en el Mapa</h2>

      {/* Formulario para seleccionar un Sneaker */}
      <Form className="mb-3">
        <Form.Group className="mb-2">
          <Form.Label>Selecciona un Sneaker</Form.Label>
          <Form.Select
            value={sneakerId}
            onChange={(e) => setSneakerId(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {sneakers.map(c => (
              <option key={c._id} value={c._id}>
                {c.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button onClick={cargarSneaker}>Cargar en el Mapa</Button>
      </Form>

      {/* Visualización del mapa con todas las ubicaciones */}
      <Mapa
        ubicaciones={ubicaciones}
        iconos={iconos}
        nombres={nombres}           // 🆕 Tooltips personalizados
        viewport={viewport}
        setViewport={setViewport}
      />
    </Container>
  );
};

export default VerMapa;
