import { useTranslation } from "react-i18next";
import { auth, loginWithGoogle, loginWithGithub, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import LanguageSelector from "../components/LanguajeSelector";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../styles/login/login.css";

const Login = () => {
    const { t } = useTranslation();
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para redirección

    useEffect(() => {
        const sendUserData = async () => {
            if (!user) return; // No ejecutar si user es null

            console.log("✅ Usuario autenticado con:", user.displayName, user.email, user.uid, user.providerData[0]?.providerId);

            try {
                const providerId = user.providerData[0]?.providerId || "unknown";

                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        uid: user.uid,
                        displayName: user.displayName,
                        providerId: providerId,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                sessionStorage.setItem("Sneakers", data.authToken);
                console.log("✅ Respuesta de la API:", data);

                // Redirigir solo después de obtener respuesta
                navigate("/dashboard");
            } catch (error) {
                console.error("❌ Error en la API:", error);
            }
        };
        sendUserData();
    }, [user]); // Solo se ejecuta cuando 'user' cambia

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegistering) {
                const response = await fetch("http://localhost:3000/api/register", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    throw new Error("Error en el registro");
                }
                const data = await response.json();
                navigate("/login");
                console.log("Registro exitoso:", data);
            } else {
                const response = await fetch("http://localhost:3000/api/loginWithEmail", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    throw new Error("Error al iniciar sesión");
                }

                const data = await response.json();
                console.log("Inicio de sesión exitoso:", data);
            }

            navigate("/dashboard"); // Redirigir después de iniciar sesión o registrarse
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="containerLogin d-flex flex-column align-items-center justify-content-center min-vh-100 px-3">
            <h1 className="titleLogin">SNEAKERS</h1>
            <LanguageSelector />
            <div className="card p-4 text-center w-100">
                <h2 className="login mb-3">{t("welcome")}</h2>
                <div className="auth d-flex justify-content-center">
                    <button onClick={loginWithGoogle} className="btn btn-auth">
                        <FcGoogle />
                    </button>
                    <button onClick={loginWithGithub} className="btn btn-auth">
                        <FaGithub />
                    </button>
                </div>
                <div className="logIn">
                {user ? (
                    <>
                        <p className="mb-3">{user.displayName || user.email}</p>
                        <button onClick={logout} className="btn btn-danger">
                            {t("logout")}
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleAuth} className="formLogin">
                        <div className="mb-4">
                            <label htmlFor="email">{t("user")}</label>
                            <input id="email" name="email" type="email" placeholder={t("email")} className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password">{t("password")}</label>
                            <input id="password" name="password" type="password" placeholder={t("password")} className="form-control" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="button">
                            {error && <p className="text-danger">{error}</p>}
                            <button type="submit" className="btn-style btn w-100">
                                {isRegistering ? t("register") : t("signIn")}
                            </button>
                        </div>
                        <div className="register">
                            <p className="question"> {t("question")}</p>
                            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="btn-style btn w-100">
                                {isRegistering ? t("signIn") : t("register")}
                            </button>
                        </div>
                    </form>
                )}
                </div>
            </div>
        </div>
    );
};

export default Login;
