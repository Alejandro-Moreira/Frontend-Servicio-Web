import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";

export const Formulario = () => {
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState({});
    const [form, setForm] = useState({
        nombre: "",
        categoria: "",  // Mantenemos categoría como un string para la selección
        precio: "",
        cantidad: "",
        descripcion: ""
    });
    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/categoria/listar`;
                const respuesta = await axios.get(url);
                if (respuesta.status === 200) {
                    setCategorias(respuesta.data);
                }
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };

        fetchCategorias();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMensaje({ respuesta: 'No estás autenticado', tipo: false });
            return;
        }

        // Verificar si la categoría existe en la lista obtenida
        const categoriaExistente = categorias.find(cat => cat.categoria.toUpperCase() === form.categoria.toUpperCase());
        if (!categoriaExistente) {
            setMensaje({ respuesta: 'Categoría inexistente', tipo: false });
            return;
        }

        const formData = new FormData();
        formData.append('cliente', userId);

        for (const key in form) {
            formData.append(key, form[key]);
        }

        if (imagen) {
            formData.append('imagen', imagen);
        }

        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos/registro`;
            console.log('URL:', url); // Verificar la URL
            const respuesta = await axios.post(url, formData, options);

            if (respuesta.status === 200) {
                setMensaje({ respuesta: 'Producto registrado con éxito', tipo: true });
                setTimeout(() => {
                    navigate('/dashboard/listar-producto');
                }, 3000);
            } else {
                setMensaje({ respuesta: respuesta.data.message, tipo: false });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMensaje({ respuesta: error.response?.data?.message || 'Hubo un error', tipo: false });
            setTimeout(() => setMensaje({}), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            <div>
                <label htmlFor='nombre' className='text-gray-700 uppercase font-bold text-sm'>Nombre del Producto:</label>
                <input
                    id='nombre'
                    type="text"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Nombre del producto'
                    name='nombre'
                    maxLength="30"
                    value={form.nombre}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='categoria' className='text-gray-700 uppercase font-bold text-sm'>Categoría:</label>
                <select
                    id='categoria'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    name='categoria'
                    maxLength="30"
                    value={form.categoria}
                    onChange={handleChange}
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.categoria}>{cat.categoria}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor='precio' className='text-gray-700 uppercase font-bold text-sm'>Precio:</label>
                <input
                    id='precio'
                    type="number"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Precio del producto'
                    name='precio'
                    maxLength="5"
                    value={form.precio}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='cantidad' className='text-gray-700 uppercase font-bold text-sm'>Cantidad:</label>
                <input
                    id='cantidad'
                    type="number"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Cantidad del producto'
                    name='cantidad'
                    maxLength="3"
                    value={form.cantidad}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='descripcion' className='text-gray-700 uppercase font-bold text-sm'>Descripción:</label>
                <textarea
                    id='descripcion'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    placeholder='Descripción del producto'
                    name='descripcion'
                    value={form.descripcion}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='imagen' className='text-gray-700 uppercase font-bold text-sm'>Imagen:</label>
                <input
                    id='imagen'
                    type="file"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                    onChange={handleImageChange}
                />
            </div>

            <input
                type="submit"
                className='bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all'
                value='Registrar Producto'
            />
        </form>
    );
};

export default Formulario;
