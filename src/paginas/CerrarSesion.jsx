import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider'; 
import Mensaje from '../componets/Alertas/Mensaje';

const CierreSesion = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [mensaje, setMensaje] = useState({});
    const navigate = useNavigate();

    const handleCancelar = () => {
        navigate(-1); // Esto navega hacia atrás en la pila de historial
    };


    const handleLogout = async () => {
        const userId = auth.userId; // Usar el userId del contexto de autenticación
        if (!userId) {
            setMensaje({ respuesta: 'No estás autenticado', tipo: false });
            return;
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/login/cierre?cliente=${userId}`;
            console.log('URL:', url); // Verificar la URL
            const response = await axios.get(url);
            if (response.status === 200) {
                setAuth({
                    nombre: '',
                    rol: '',
                    token: '',
                    userId: ''
                }); // Limpiar el contexto de autenticación
                localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
                localStorage.removeItem('userId'); // Eliminar el userId del almacenamiento local
                localStorage.removeItem('nombre'); // Eliminar el nombre del almacenamiento local
                localStorage.removeItem('rol'); // Eliminar el rol del almacenamiento local
                localStorage.removeItem('cartItems');//Eliminar el carrito del almacenamiento local
                setMensaje({ respuesta: 'Sesión cerrada con éxito', tipo: true });
                navigate('/');

            } else {
                setMensaje({ respuesta: 'Hubo un problema al cerrar la sesión', tipo: false });
            }
        } catch (error) {
            console.error('Error al cerrar la sesión:', error);
            setMensaje({ respuesta: 'Hubo un error al cerrar la sesión', tipo: false });
        }
    };

    return (
        <div className="logout-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>¿Estás seguro de que quieres cerrar la sesión?</h2>
                {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <button 
                        onClick={handleLogout} 
                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-800 m-2"
                    >
                        Cerrar Sesión
                    </button>
                    <button
                        onClick={handleCancelar} 
                    className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-800 m-2"
                    >
                        Cancelar
                    </button>
        </div>

    );
};

export default CierreSesion;