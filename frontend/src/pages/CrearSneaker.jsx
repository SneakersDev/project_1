
import { Link } from "react-router-dom"; // Asegúrate de importar Link
import SneakerForm from "../components/SneakerForm"; // Asegúrate de que la ruta esté correcta
import { Container } from "react-bootstrap";

const CrearSneaker = () => {
    return (
        <div>
            {/* Navbar con enlaces */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
                <div className="navbar-nav">
                    <Link className="nav-link" to="/crear-sneaker">
                        Crear Sneaker
                    </Link>
                    <Link className="nav-link" to="/agregar-sede">
                        Agregar tienda
                    </Link>
                </div>
            </nav>

            {/* Contenedor con el formulario */}
            <Container>
                <h2 className="mt-4 mb-3">Registro de Sneaker</h2>
                <SneakerForm />
            </Container>
        </div>
    );
};

export default CrearSneaker;
