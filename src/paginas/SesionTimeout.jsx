import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../componets/Alertas/Mensaje';

const SessionTimeout = ({ timeout, children }) => {
    const [isInactive, setIsInactive] = useState(false);
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('nombre');
        localStorage.removeItem('userId');
        setAuth({
            nombre: '',
            rol: '',
            token: '',
            userId: ''
        });
        setIsInactive(true);
        navigate('/login');
    }, [setAuth, navigate]);

    useEffect(() => {
        const handleActivity = () => {
            clearTimeout(window.sessionTimeout);
            window.sessionTimeout = setTimeout(logout, timeout);
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        window.sessionTimeout = setTimeout(logout, timeout);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            clearTimeout(window.sessionTimeout);
        };
    }, [logout, timeout]);

    return (
        <div>
            {isInactive && <Mensaje tipo={false}>Su sesión caducó</Mensaje>}
            {children}
        </div>
    );
};

export default SessionTimeout;