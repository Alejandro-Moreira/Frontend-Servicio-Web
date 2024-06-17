import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        nombre: localStorage.getItem('nombre') || '',
        rol: localStorage.getItem('rol') || '',
        token: localStorage.getItem('token') || '',
        userId: localStorage.getItem('userId') || ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');
        const nombre = localStorage.getItem('nombre');
        const userId = localStorage.getItem('userId');
        if (token && rol && nombre && userId) {
            setAuth({ token, rol, nombre, userId });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('token', auth.token);
        localStorage.setItem('rol', auth.rol);
        localStorage.setItem('nombre', auth.nombre);
        localStorage.setItem('userId', auth.userId);
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
export default AuthContext;