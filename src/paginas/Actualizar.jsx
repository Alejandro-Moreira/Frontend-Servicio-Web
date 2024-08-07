import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const ActualizarProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState({});
    const [form, setForm] = useState({
        nombre: "",
        categoria: "",
        precio: 0,
        cantidad: 0,
        descripcion: ""
    });
    const [imagen, setImagen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        // Cargar datos del producto
        const cargarProducto = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/productos/listar`;
                const { data } = await axios.get(url);
                const producto = data.find(p => p._id === id);
                if (producto) {
                    setForm({
                        nombre: producto.nombre || "",
                        categoria: producto.categoria || "",
                        precio: producto.precio || 0,
                        cantidad: producto.cantidad || 0,
                        descripcion: producto.descripcion || ""
                    });
                } else {
                    setMensaje({ respuesta: 'Producto no encontrado', tipo: false });
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el producto:", error);
                setMensaje({ respuesta: 'Error al cargar el producto', tipo: false });
                setLoading(false);
            }
        };

        // Cargar categorías
        const cargarCategorias = async () => {
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

        cargarProducto();
        cargarCategorias();
    }, [id]);

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

        // Verificar si la categoría existe
        const categoriaExistente = categorias.find(cat => cat.categoria.toUpperCase() === form.categoria.toUpperCase());
        if (!categoriaExistente) {
            setMensaje({ respuesta: 'Categoría inexistente', tipo: false });
            return;
        }

        const formData = new FormData();
        formData.append('cliente', userId);

        // Añadir solo los campos que han sido modificados
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== "") {
                formData.append(key, form[key]);
            }
        });

        if (imagen) {
            formData.append('imagen', imagen);
        }

        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos/actualizar/${id}`;
            const respuesta = await axios.put(url, formData, options);

            if (respuesta.status === 200) {
                if(respuesta.data.message == 'El precio debe de ser mayor a 0'){
                    setMensaje({ respuesta: 'El precio debe de ser mayor a 0', tipo: false });
                }else if(respuesta.data.message == 'La cantidad debe de ser mayor a 0'){
                    setMensaje({ respuesta: 'La cantidad debe de ser mayor a 0', tipo: false });
                }else if(respuesta.data.message == 'No existe esa categoria'){
                    setMensaje({ respuesta: 'No existe esa categoria', tipo: false });
                }else if(respuesta.data.message == 'Ya existe un producto con ese nombre.'){
                    setMensaje({ respuesta: 'Ya existe un producto con ese nombre', tipo: false });
                }else{
                    setMensaje({ respuesta: 'Producto actualizado con éxito', tipo: true });
                    setTimeout(() => {
                        navigate('/dashboard/listar-producto');
                    }, 3000);
                    
                }
            } else {
                setMensaje({ respuesta: respuesta.data.message, tipo: false });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMensaje({ respuesta: error.response?.data?.message || 'Hubo un error', tipo: false });
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className="font-black text-4xl text-gray-500">Actualizar Producto</h1>
            <hr className="my-4" />
            <p className="mb-8">Este módulo te permite actualizar los detalles de un producto existente.</p>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            <form onSubmit={handleSubmit}>
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
                <div className="flex justify-between">
                    <input
                        type="submit"
                        className='bg-blue-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-blue-800 cursor-pointer transition-all'
                        value='Actualizar Producto'
                    />
                    <button
                        type="button"
                        className='bg-gray-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition-all'
                        onClick={() => navigate('/dashboard/listar-producto')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActualizarProducto;