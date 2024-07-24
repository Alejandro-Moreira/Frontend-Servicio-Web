import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const EliminarProducto = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [mensaje, setMensaje] = useState({});

    const handleDelete = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMensaje({ respuesta: 'No estás autenticado', tipo: false });
            return;
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos/borrar/${id}`;
            const respuesta = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: { cliente: userId }
            });

            if (respuesta.status === 200) {
                setMensaje({ respuesta: 'Producto eliminado con éxito', tipo: true });
                setTimeout(() => {
                    navigate('/dashboard/listar-producto');
                }, 3000);
            } else {
                setMensaje({ respuesta: respuesta.data.message, tipo: false });
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            setMensaje({ respuesta: 'Hubo un error al eliminar el producto', tipo: false });
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/listar-producto');
    };

    return (
        <div className="my-5">
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            <div className="text-center">
                <h2 className='text-gray-700 uppercase font-bold text-lg mb-5'>¿Seguro que quieres eliminar el producto?</h2>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleDelete}
                        className='bg-red-600 w-1/4 p-3 text-white uppercase font-bold rounded-lg hover:bg-red-800 cursor-pointer transition-all'
                    >
                        Borrar Producto
                    </button>
                    <button
                        onClick={handleCancel}
                        className='bg-gray-600 w-1/4 p-3 text-white uppercase font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition-all'
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EliminarProducto;
