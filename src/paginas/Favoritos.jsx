import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { FaTrashAlt, FaArrowLeft, FaShoppingCart, FaList, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal'; 
import ModalCarrito from '../componets/Modals/ModalCarrito';
import CategoryList from './CategoriaCliente';

Modal.setAppElement('#root'); 

export const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [producto, setProducto] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú de hamburguesa
    const { auth } = useContext(AuthContext);
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerFavoritos = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const response = await axios.get(`${baseUrl}/favoritos/listar?cliente=${userId}`);
                if (response.data.message) {
                    setMensaje(response.data.message);
                } else {
                    setFavoritos(response.data);
                }
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
                setMensaje('Error al obtener favoritos');
            }
        };

        if (auth?.userId) {
            obtenerFavoritos();
        } else {
            setMensaje('Usuario no autenticado');
        }
    }, [auth?.userId]);

    const BorrarFavoritos = async (productoId) => {
        try {
            await axios({
                method: 'delete',
                url: `${baseUrl}/favoritos/borrar/${productoId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { cliente: auth.userId },
            });
            setFavoritos(prevFavoritos => prevFavoritos.filter(favorito => favorito._id !== productoId));
            setMensaje('Producto eliminado de favoritos');
        } catch (error) {
            setMensaje('Error al borrar el producto de favoritos');
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const handleAddToCartClick = async (producto) => {
        try {
            await axios.post(`${baseUrl}/pedidos/agregar`, {
                cliente: auth.userId,
                producto: producto.producto,
                cantidad: cantidad
            });
            let updatedCartItems = [...cartItems, { ...producto, cantidad }];
            setCartItems(updatedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            setMensajeConfirmacion('Producto añadido al carrito con éxito');
            setTimeout(() => setMensajeConfirmacion(''), 3000);
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
            setMensaje('Error al añadir producto al carrito');
        }
    };

    const isInCart = (productoId) => {
        return cartItems.some(item => item._id === productoId);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCategorySelect = () => {
        setIsMenuOpen(false); // Cierra el menú de hamburguesa cuando se selecciona una categoría
    };

    return (
        <main className='bg-white px-10 md:px-20 lg:px-40'>
            <section className='flex items-center justify-between'>
                <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Favoritos</h2>
                <div className='flex space-x-4'>
                    <button onClick={() => navigate(-1)} className="text-teal-600">
                        <FaArrowLeft size={30} />
                    </button>
                    <button onClick={() => navigate('/carrito-compra')} className="text-teal-600">
                        <FaShoppingCart size={30} />
                    </button>
                    <button onClick={toggleMenu} className="text-teal-600">
                        {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
                    </button>
                    <button onClick={() => navigate('/historial-pedidos')} className="text-teal-600">
                        <FaHistory size={30} /> 
                    </button>
                </div>
            </section>

            {isMenuOpen && (
                <section className="bg-gray-100 p-4 rounded-lg shadow-lg absolute top-16 left-0 w-full md:w-1/3 z-10">
                    <CategoryList onCategorySelect={handleCategorySelect} /> {/* Pasa la función como prop */}
                </section>
            )}

            {mensaje && (
                <div className="bg-red-500 text-white px-4 py-2 rounded mt-4">
                    {mensaje}
                </div>
            )}
            {mensajeConfirmacion && (
                <div className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                    {mensajeConfirmacion}
                </div>
            )}
            <section>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center'>
                    {favoritos.map((favorito) => (
                        <div key={favorito._id} className='thumb-block'>
                            <div className='text-center shadow-2xl p-10 rounded-xl my-10'>
                                <img 
                                    className='mx-auto h-40 w-40 object-cover'
                                    src={favorito.imagen?.secure_url ? favorito.imagen.secure_url : ''}
                                    alt={favorito.nombre}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "" }}
                                />
                                <h3 className='text-lg font-medium pt-8 pb-2'>{favorito.nombre}</h3>
                                <p className='text-gray-800 py-1'>{favorito.descripcion}</p>
                                <p className='text-gray-800 py-1'>{favorito.categoria}</p>
                                <p className='text-gray-800 py-1'>$ {favorito.precio.toFixed(2)}</p>
                                {!isInCart(favorito._id) && (
                                    <button onClick={() => handleAddToCartClick(favorito)} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Añadir al carrito</button>
                                )}
                                <button onClick={() => BorrarFavoritos(favorito._id)} className="text-teal-600 ml-4">
                                    <FaTrashAlt size={20} /> 
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {modalIsOpen && (
                <ModalCarrito onClose={() => setModalIsOpen(false)}>
                    <h2>{isInCart(producto?._id) ? 'Actualizar Producto del Carrito' : 'Agregar Producto al Carrito'}</h2>
                    <p>{producto && producto.nombre}</p>
                    <input 
                        type="number" 
                        placeholder="Cantidad" 
                        value={cantidad} 
                        onChange={(e) => setCantidad(Math.min(20, Math.max(1, Number(e.target.value))))} 
                        min="1" 
                        max="20" 
                        className="border p-2 rounded"
                    />
                    {isInCart(producto?._id) (
                        <button onClick={handleAddToCartClick} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">
                            Agregar
                        </button>
                    )}
                </ModalCarrito>
            )}

            {mensajeConfirmacion && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
                    {mensajeConfirmacion}
                </div>
            )}
        </main>
    );
};