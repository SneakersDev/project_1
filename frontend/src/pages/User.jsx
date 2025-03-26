// pages/User.jsx
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { RiHomeLine } from "react-icons/ri";

import { FaRegHeart } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import "../styles/user/userProfile.css";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

const User = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="containerDashboard">
      <div className="home-button">
        <Nav showHomeOnly={true}/>
      </div>
      <div className="container">
        <div className="user-container">
          <div className="user-image">
            <AiOutlineUser className="user-icon" />
          </div>
          <div className="user-info">
            <label htmlFor="user" className="user-text">Usuario:</label>
            <input
              type="text"
              value={user ? user.displayName || user.email : "Invitado"}
              readOnly
              className="user-input"
              disabled
              id="user"
            />
          </div>
          {user && (
            <button onClick={handleLogout} className="logout-button">
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
      {/* Mobile Nav (Visible solo en ciertas resoluciones) */}
      <div className="mobile-nav userMobile">
        <button
          className="btn btn-primary mobile-modal"
          data-bs-toggle="modal"
          data-bs-target="#mobileOptionsModal"
          aria-label="Más opciones"
        >
          <IoMdSettings />
        </button>
      </div>

      {/* Modal con herramientas adicionales */}
      <div
        className="modal fade"
        id="mobileOptionsModal"
        tabIndex="-1"
        aria-labelledby="mobileOptionsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="mobileOptionsModalLabel">
                Herramientas
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              <div className="buttonsMobile">
                <p className="textMobile">
                  Navega por las secciones de la página:
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn btn-primary btnMobiles"
                  aria-label="Mapa"
                >
                  Home <RiHomeLine />
                </button>
                <hr/>
                <button
                  onClick={() => navigate("/favorites")}
                  className="btn btn-primary btnMobiles"
                  aria-label="Favoritos"
                >
                  Favoritos <FaRegHeart />
                </button>
                <hr />
                <button
                  onClick={() => navigate("/Map")}
                  className="btn btn-primary btnMobiles"
                  aria-label="Mapa"
                >
                  Localización <SiGooglemaps />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default User;
