import { useEffect, useState } from 'react';
import api from '../api/api';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SneakerGrid = () => {
  const [sneakers, setSneakers] = useState([]);
  const navigate = useNavigate();

  const cargarSneakers = () => {
    api.get('/sneakers')
      .then(res => setSneakers(res.data))
      .catch(err => toast.error('Error cargando sneakers'));
  };

  useEffect(() => {
    cargarSneakers();
  }, []);

  const eliminarSneaker = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este sneaker?')) return;
    try {
      await api.delete(`/sneakers/${id}`);
      toast.success('Sneaker eliminado');
      cargarSneakers();
    } catch (err) {
      toast.error('Error al eliminar sneaker');
    }
  };

  return (
    <div>
      <h4 className="mt-4">Sneakers registrados</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Modelo</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sneakers.map(sneaker => (
            <tr key={sneaker._id}>
              <td>{sneaker.razonSocial}</td>
              <td>{sneaker.direccion}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/ver-mapa?sneaker=${sneaker._id}`)}
                >
                  Ver en Mapa
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/agregar-sede?sneaker=${sneaker._id}`)}
                >
                  Agregar Sede
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarSneaker(sneaker._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SneakerGrid;