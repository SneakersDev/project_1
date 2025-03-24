// pages/User.jsx
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
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
        <Nav showHomeOnly={true} />
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
      <Footer />
    </div>
  );
};

export default User;
