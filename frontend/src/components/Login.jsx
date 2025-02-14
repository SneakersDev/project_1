import { useTranslation } from "react-i18next";
import { auth, loginWithGoogle, loginWithGithub, registerWithEmail, loginWithEmail, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

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
                await registerWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            navigate("/dashboard"); // Redirigir después de iniciar sesión
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "400px" }}>
                <h2 className="mb-3 text-primary">{t("welcome")}</h2>
                {user ? (
                    <>
                        <p className="mb-3 font-weight-bold">{user.displayName || user.email}</p>
                        <button onClick={logout} className="btn btn-danger">
                            {t("logout")}
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleAuth}>
                        <div className="mb-3">
                            <input type="email" placeholder={t("email")} className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <input type="password" placeholder={t("password")} className="form-control" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <button type="submit" className="btn btn-success w-100">
                            {isRegistering ? t("register") : t("signIn")}
                        </button>
                        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="btn btn-link">
                            {isRegistering ? t("signIn") : t("register")}
                        </button>
                    </form>
                )}
                <button onClick={loginWithGoogle} className="btn btn-dark mt-3 w-100">
                    {t("signInWithGoogle")}
                </button>
                <button onClick={loginWithGithub} className="btn btn-dark mt-3 w-100">
                    {t("signInWithGitHub")}
                </button>
            </div>
        </div>
    );
};

export default Login;
