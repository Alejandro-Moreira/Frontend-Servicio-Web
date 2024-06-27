import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const CrearCategoria = () => {
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState({});
    const [nombreCategoria, setNombreCategoria] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setNombreCategoria(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMensaje({ respuesta: 'No estás autenticado', tipo: false });
            return;
        }

        const formData = new FormData();
        formData.append('categoria', nombreCategoria);
        formData.append('cliente', userId);

        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            const url = `${backendUrl}/categoria/registro`;
            const respuesta = await axios.post(url, formData, options);

            if (respuesta.status === 200) {
                if(respuesta.data.message == 'Ya existe esa categoria'){
                    setMensaje({ respuesta: 'Ya existe esa categoria', tipo: false });
                }else{
                    setMensaje({ respuesta: 'Categoría registrada con éxito', tipo: true });
                    setTimeout(() => {
                        navigate('/dashboard/categoria-listar');
                    }, 3000);
                }
            } else {
                setMensaje({ respuesta: respuesta.data.message, tipo: false });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMensaje({ respuesta: error.response?.data?.message });
            setTimeout(() => setMensaje({}), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            <div>
                <label htmlFor='nombreCategoria' className='text-gray-700 uppercase font-bold text-sm'>Nombre de la Categoría:</label>
                <input
                    id='nombreCategoria'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Nombre de la categoría'
                    name='nombreCategoria'
                    value={nombreCategoria}
                    onChange={handleChange}
                />
            </div>
            <input
                type="submit"
                className='bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all'
                value='Registrar Categoría'
            />
        </form>
    );
};

export default CrearCategoria;