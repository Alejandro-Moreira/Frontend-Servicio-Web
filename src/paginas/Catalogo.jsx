import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider'; // Asegúrate de que la ruta sea correcta

Modal.setAppElement('#root'); // Necesario para accesibilidad

export const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
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

    const addToCart = (item) => {
        let updatedCartItems = [...cartItems, item];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setModalIsOpen(true);
    };

    return (
        <main className='bg-white px-10 md:px-20 lg:px-40'>
            <section>
                <div className='text-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Productos Disponibles</h2>
                </div>
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
                                <p className='text-gray-800 py-1'>{producto.descripcion}</p>
                                <p className='text-gray-800 py-1'>{producto.categoria}</p>
                                <p className='text-gray-800 py-1'>$ {producto.precio.toFixed(2)}</p>
                                <button onClick={() => addToCart(producto)} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
            >
                <h2>Carrito de Compras</h2>
                {cartItems.length === 0 ? (
                    <p>No hay productos en el carrito.</p>
                ) : (
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>{item.nombre} - $ {item.precio.toFixed(2)}</li>
                        ))}
                    </ul>
                )}
                <button onClick={() => navigate('/cart')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Ir al Carrito</button>
                <button onClick={() => setModalIsOpen(false)} className="bg-gray-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-gray-800">Cerrar</button>
            </Modal>
        </main>
    );
};
