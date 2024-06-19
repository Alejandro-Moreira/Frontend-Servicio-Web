import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider'; // Asegúrate de que la ruta sea correcta

export const Productos = () => {
    const [productos, setProductos] = useState([]);
    const { auth } = useContext(AuthContext); // Usar el contexto de autenticación
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products from the backend
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/listar`)
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <main className='bg-white px-10 md:px-20 lg:px-40'>
            <section className="flex justify-between items-center py-4">
                <h1 className="font-black text-4xl text-gray-500 mb-5">Productos Disponibles</h1>
                <button 
                    onClick={() => navigate('/dashboard/crear-producto')} 
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-800 flex items-center"
                >
                    Crear Producto
                </button>
            </section>

            <section>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center'>
                    {productos.map((producto) => (
                        <div key={producto._id} className='thumb-block'>
                            <div className='text-center shadow-2xl p-10 rounded-xl my-10'>
                                <img 
                                    className='mx-auto h-40 w-40 object-cover'
                                    src={producto.imagen?.secure_url ? producto.imagen.secure_url : 'URL_ALTERNATIVA_AQUÍ'}
                                    alt={producto.nombre}
                                    onError={(e) => {e.target.onerror = null; e.target.src="URL_ALTERNATIVA_AQUÍ"}}
                                />
                                <h3 className='text-lg font-medium pt-8 pb-2'>{producto.nombre}</h3>
                                <p className='text-gray-800 py-1'>{producto.categoria}</p>
                                <p className='text-gray-800 py-1'>$ {producto.precio.toFixed(2)}</p>
                                <p className='text-gray-800 py-1'>{producto.descripcion}</p>
                                <p className='text-gray-800 py-1'>{producto.cantidad}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Productos;
