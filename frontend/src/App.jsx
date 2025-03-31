import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import Sneaker from "./pages/Sneaker";
import User from "./pages/User";
import Favorites from "./pages/Favorites";
import "bootstrap/dist/css/bootstrap.min.css";
import VerMapa from "./pages/VerMapa";
import AgregarSede from "./pages/AgregarSede";
import CrearSneaker from "./pages/CrearSneaker";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user" element={<User />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/settings" element={<CrearSneaker />} />
                <Route path="/sneaker/:id" element={<Sneaker />} />
                <Route path="/map" element={<VerMapa />} />
                <Route path="/agregar-sede" element={<AgregarSede />} />
                <Route path="/crear-sneaker" element={<CrearSneaker />} />
            </Routes>
        </Router>
    );
};

export default App;
