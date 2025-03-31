import { useState, useEffect } from 'react';
import api from '../api/api';               // Cliente Axios para llamadas al backend
import { Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';       // Notificaciones visuales al usuario
import Mapa from './Mapa';                 // Componente de mapa reutilizable (Mapbox)

const SedeForm = () => {
  // Lista de clientes para asignar la sede
  const [sneakers, setSneakers] = useState([]);

  // Datos del formulario de sede
  const [form, setForm] = useState({
    sneakerId: '',       // ID del sneaker seleccionado
    nombre: '',          // Nombre de la sede
    direccion: ''        // Dirección textual
  });

  const [imagen, setImagen] = useState(null);  // Imagen opcional para la sede

  // Coordenadas seleccionadas (latitud y longitud)
  const [coordenadas, setCoordenadas] = useState(null);

  // Valores editables manualmente en inputs
  const [latitudManual, setLatitudManual] = useState('');
  const [longitudManual, setLongitudManual] = useState('');

  // Al cargar el componente, obtener lista de sneakers desde el backend
  useEffect(() => {
    api.get('/sneakers')
      .then(res => setSneakers(res.data))
      .catch(err => toast.error('Error cargando clientes'));
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cuando se hace clic en el mapa o se selecciona desde el buscador
  const manejarSeleccionEnMapa = ({ lng, lat }) => {
    setCoordenadas({ lng, lat });      // Guardar en estado central
    setLatitudManual(lat);            // Reflejar en los inputs
    setLongitudManual(lng);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.sneakerId || (!latitudManual || !longitudManual)) {
      toast.error('Selecciona sneaker y ubicación');
      return;
    }

    // Construir objeto tipo GeoJSON
    const coords = {
      type: 'Point',
      coordinates: [
        parseFloat(longitudManual),
        parseFloat(latitudManual)
      ]
    };

    // Construcción del formulario para enviar al backend
    const data = new FormData();
    data.append('sneakerId', form.sneakerId);
    data.append('nombre', form.nombre);
    data.append('direccion', form.direccion);
    data.append('ubicacion', JSON.stringify(coords));
    if (imagen) data.append('imagen', imagen);

    // Enviar al backend
    try {
      await api.post('/sedes', data);
      toast.success('Sede registrada exitosamente');

      // Limpiar formulario al finalizar
      setForm({ sneakerId: '', nombre: '', direccion: '' });
      setImagen(null);
      setLatitudManual('');
      setLongitudManual('');
      setCoordenadas(null);
    } catch (err) {
      console.error(err);
      toast.error('Error al crear sede');
    }
  };

  // Render del formulario
  return (
    <div className="container mt-4">
      <Form onSubmit={handleSubmit} encType="multipart/form-data" className="mb-3">

        {/* Selección de Sneaker */}
        <Form.Group className="mb-2">
          <Form.Label>Sneaker</Form.Label>
          <Form.Select
            name="sneakerId"
            value={form.sneakerId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un sneaker</option>
            {sneakers.map(cli => (
              <option key={cli._id} value={cli._id}>{cli.nombre}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Nombre de la sede */}
        <Form.Group className="mb-2">
          <Form.Label>Nombre de la tienda</Form.Label>
          <Form.Control
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Dirección de la sede */}
        <Form.Group className="mb-2">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Imagen opcional */}
        <Form.Group className="mb-2">
          <Form.Label>Imagen (opcional)</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </Form.Group>

        {/* Entrada manual de coordenadas */}
        <Form.Group className="mb-2">
          <Form.Label>Latitud</Form.Label>
          <Form.Control
            type="number"
            value={latitudManual}
            onChange={(e) => setLatitudManual(e.target.value)}
            step="any"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Longitud</Form.Label>
          <Form.Control
            type="number"
            value={longitudManual}
            onChange={(e) => setLongitudManual(e.target.value)}
            step="any"
          />
        </Form.Group>

        <Button type="submit" variant="primary">Guardar tienda</Button>
      </Form>

      {/* Mapa para seleccionar coordenadas visualmente */}
      <div className="mb-3">
        <h5>Selecciona la ubicación de la tienda en el mapa</h5>
        <Mapa
          coordenadas={coordenadas}
          onCoordenadasChange={manejarSeleccionEnMapa}
        />
      </div>
    </div>
  );
};

export default SedeForm;

