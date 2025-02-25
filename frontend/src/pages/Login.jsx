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
import Swal from "sweetalert2";

const Login = () => {
    const { t } = useTranslation();
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
        console.log("isRegistering:", isRegistering);
    
        // Validar si es registro y si las contraseñas coinciden
        if (isRegistering && password !== confirmPassword) {
            Swal.fire({
                title: "¡Error!",
                text: "Las contraseñas no coinciden.",
                icon: "error",
                confirmButtonColor: "black"
            });
            return; // No enviar datos si las contraseñas no son iguales
        }

        try {
            if (isRegistering) {
                console.log("Enviando solicitud de registro...");
                const response = await fetch("http://localhost:3000/api/register", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
    
                if (!response.ok) {
                    throw new Error("Error en el registro. El correo ingresado no es válido o ya está registrado en el sistema.");
                }
    
                const data = await response.json();
                console.log("Registro exitoso:", data);
    
                // Mostrar alerta de éxito con botón de confirmación
                Swal.fire({
                    title: "¡Registro Exitoso!",
                    text: "El usuario ha sido registrado correctamente.",
                    icon: "success",
                    confirmButtonText: "Continuar",
                    confirmButtonColor: "black"
                }).then(() => {
                    navigate("/login"); // Redirige solo después de que el usuario haga clic
                });
    
            } else {
                console.log("Enviando solicitud de inicio de sesión...");
                const response = await fetch("http://localhost:3000/api/loginWithEmail", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
    
                if (!response.ok) {
                    throw new Error("Error al iniciar sesión. Por favor, revisa la información ingresada.");
                }
    
                const data = await response.json();
                console.log("Inicio de sesión exitoso:", data);
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
    
            // Mostrar alerta con mensaje de error
            Swal.fire({
                title: "¡Error!",
                text: err.message,
                icon: "error",
                confirmButtonColor: "black"
            });
        }
    };
    
    
    return (
        <div className="login-container">
            <LanguageSelector />
            <div className={`container ${isRegistering ? "active" : ""}`}>
                <div className="form-container sign-up col-12 col-md-6">
                    {user ? (
                        <>
                            <p className="mb-3">{user.displayName || user.email}</p>
                            <button onClick={logout} className="btn btn-danger">
                                {t("logout")}
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleAuth} className="formLogin">
                            <h1 className="login">{t("signIn")}</h1>
                            <div className="social-icons">
                                <button type="button" onClick={loginWithGoogle} className="btn btn-auth" aria-label="Iniciar sesión con Google">
                                    <FcGoogle />
                                </button>
                                <button type="button" onClick={loginWithGithub} className="btn btn-auth" aria-label="Iniciar sesión con GitHub">
                                    <FaGithub />
                                </button>
                            </div>
                            <span> {t("singInAccount")} </span>
                            <div className="loginDates">
                                <div>
                                    <label htmlFor="email">{t("user")}</label>
                                    <input id="email" name="email" type="email" placeholder={t("email")} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label htmlFor="password">{t("password")}</label>
                                    <input id="password" name="password" type="password" placeholder={t("password")} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                {isRegistering && (
                                    <div>
                                        <label htmlFor="confirmPassword">{t("confirmPasswordtext")}</label>
                                        <input id="confirmPassword" type="password" placeholder={t("confirmPasswordtext")} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                )}
                                <div className="button">
                                    {error && <p className="text-danger">{error}</p>}
                                    <button type="submit" className="create">
                                        {isRegistering ? t("register") : t("signIn")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                <div className="form-container sign-in">
                    {user ? (
                        <>
                            <p className="mb-3">{user.displayName || user.email}</p>
                            <button onClick={logout} className="btn btn-danger">
                                {t("logout")}
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleAuth}>
                            <h1 className="login">{t("loginAccount")}</h1>
                            <div className="social-icons">
                                <button type="button" onClick={loginWithGoogle} className="btn btn-auth" aria-label="Iniciar sesión con Google">
                                    <FcGoogle />
                                </button>
                                <button type="button" onClick={loginWithGithub} className="btn btn-auth" aria-label="Iniciar sesión con Github">
                                    <FaGithub />
                                </button>
                            </div>
                            <span> {t("loginAccountEmail")} </span>
                            <div className="loginDates">
                                <div>
                                    <label htmlFor="emailLogin">{t("user")}</label>
                                    <input id="emailLogin" name="email" type="email" placeholder={t("email")} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label htmlFor="passwordLogin">{t("password")}</label>
                                    <input id="passwordLogin" name="password" type="password" placeholder={t("password")} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </div>
                            <div className="register">
                                {error && <p className="text-danger">{error}</p>}
                                <button type="submit" className="create">
                                    {t("logIn")}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h2>{t("questionLog")}</h2>
                            <p>{t("textLog")}</p>
                            <button className="hidden" type="button" onClick={() => setIsRegistering(false)}>
                                {t("logIn")}
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h2>{t("questionAccount")}</h2>
                            <p>{t("textAccount")}</p>
                            <button className="hidden" type="button" onClick={() => setIsRegistering(true)}>
                                {t("register")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
