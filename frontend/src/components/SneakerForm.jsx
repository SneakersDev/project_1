import { useState } from 'react';
import axios from '../api/api'; // Importa la instancia de Axios configurada
import Mapa from './Mapa'; // Componente de mapa reutilizable

const SneakerForm = () => {
  // Estados del formulario

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modelo, setModelo] = useState('');
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);
  const [coordenadas, setCoordenadas] = useState(null); // Coordenadas seleccionadas en el mapa
  const [latitudManual, setLatitudManual] = useState('');
  const [longitudManual, setLongitudManual] = useState('');

  // Cuando el usuario selecciona en el mapa, también se actualizan los inputs de coordenadas
  //const manejarSeleccionEnMapa = (coords) => {
  //  setCoordenadas(coords);
  //  setLatitudManual(coords.coordinates[1]);
 //   setLongitudManual(coords.coordinates[0]);
 // };

  const manejarSeleccionEnMapa = ({ lng, lat }) => {
    setCoordenadas({ lng, lat });
    setLatitudManual(lat);
    setLongitudManual(lng);
  };
  




  // Función para manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('modelo', modelo);
      formData.append('talla', talla);
      formData.append('color', color);
      formData.append('precio', precio);

      if (imagen) {
        formData.append('imagen', imagen);
      }

      const coords = {
        type: 'Point',
        coordinates: [
          parseFloat(longitudManual),
          parseFloat(latitudManual)
        ]
      };

      if (!coords.coordinates[0] || !coords.coordinates[1]) {
        alert('Por favor seleccione una ubicación en el mapa o ingrese coordenadas.');
        return;
      }

      formData.append('ubicacion', JSON.stringify(coords));

      const response = await axios.post('/sneakers', formData);
      alert('Sneaker creado correctamente.');
      console.log(response.data);

      // Limpieza
      setNombre('');
      setDescripcion('');
      setModelo('');
      setTalla('');
      setColor('');
      setPrecio('');
      setImagen(null);
      setCoordenadas(null);
      setLatitudManual('');
      setLongitudManual('');
    } catch (error) {
      console.error('Error al guardar el sneaker:', error);
      alert('Ocurrió un error al guardar el el sneaker.');
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descripción</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Modelo</label>
          <input
            type="text"
            className="form-control"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Talla</label>
          <input
            type="text"
            className="form-control"
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Color</label>
          <input
            type="text"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Precio</label>
          <input
            type="number"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Imagen (opcional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label>Latitud</label>
          <input
            type="number"
            className="form-control"
            value={latitudManual}
            onChange={(e) => setLatitudManual(e.target.value)}
            step="any"
          />
        </div>

        <div className="mb-3">
          <label>Longitud</label>
          <input
            type="number"
            className="form-control"
            value={longitudManual}
            onChange={(e) => setLongitudManual(e.target.value)}
            step="any"
          />
        </div>

        <div className="mb-3">
          <h5>Ubicación del sneaker</h5>
          <Mapa
            coordenadas={coordenadas}
            onCoordenadasChange={manejarSeleccionEnMapa}

            // modo="seleccion"
            // onSeleccionarCoordenadas={manejarSeleccionEnMapa}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar Sneaker
        </button>
      </form>
    </div>
  );
};

export default SneakerForm;
