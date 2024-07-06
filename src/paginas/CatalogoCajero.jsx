import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { FaShoppingCart, FaSignOutAlt, FaHistory, FaBars, FaTimes, FaCalendarCheck, FaFileInvoice } from 'react-icons/fa';
import Modal from 'react-modal'; 
import ModalCarrito from '../componets/Modals/ModalCarrito';
import { SearchInput } from './Barrabusqueda';
import { getProductosListar } from "./../services/getProductosListar";
import CategoryList from './CategoriaCliente';
import Mensaje from '../componets/Alertas/Mensaje';
import { useWindowWidth } from '../hooks/useWindowWidth'

Modal.setAppElement('#root'); 

export const CatalogoCajero = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const windowWidth = useWindowWidth();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [producto, setProducto] = useState(null);
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(null); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [productModalIsOpen, setProductModalIsOpen] = useState(false);
    const [productError, setProductError] = useState(null);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        getProductosListar()
            .then(response => {
                setProductos(response.data);
                setFilteredProductos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
            });
    }, []);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleAddToCartClick = (producto) => {
        setProducto(producto);
        setCantidad(1);
        setModalIsOpen(true);
    };

    const handleUpdateCartClick = (producto) => {
        setProducto(producto);
        const itemInCart = cartItems.find(item => item._id === producto._id);
        setCantidad(itemInCart ? itemInCart.cantidad : 1);
        setModalIsOpen(true);
    };

    const addToCart = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ventas/agregar`, {
                cliente: auth.userId,
                producto: producto._id,
                cantidad: cantidad
            });

            const itemInCart = cartItems.find(item => item._id === producto._id);
            let updatedCartItems;

            if (itemInCart) {
                updatedCartItems = cartItems.map(item =>
                    item._id === producto._id ? { ...item, cantidad: item.cantidad + cantidad } : item
                );
            } else {
                updatedCartItems = [...cartItems, { ...producto, cantidad }];
            }

            setCartItems(updatedCartItems);
            setMensajeConfirmacion('Producto añadido con éxito');
            setTipoMensaje(true); 
            setTimeout(() => {
                setMensajeConfirmacion('');
                setTipoMensaje(null);
            }, 3000);
            setModalIsOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al añadir producto';
            setMensajeConfirmacion(errorMessage);
            setTipoMensaje(false); 
            setTimeout(() => {
                setMensajeConfirmacion('');
                setTipoMensaje(null);
            }, 3000);
            if (error.response?.data?.disponible) {
                setCantidad(error.response.data.disponible);
            }
        }
    };

    const updateCart = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/ventas/actualizar/${producto._id}`, {
                cliente: auth.userId,
                cantidad: cantidad
            });

            const updatedCartItems = cartItems.map(item =>
                item._id === producto._id ? { ...item, cantidad: cantidad } : item
            );
            setCartItems(updatedCartItems);
            setMensajeConfirmacion('Producto actualizado con éxito');
            setTipoMensaje(true); 
            setTimeout(() => {
                setMensajeConfirmacion('');
                setTipoMensaje(null);
            }, 3000);
            setModalIsOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al actualizar producto';
            setMensajeConfirmacion(errorMessage);
            setTipoMensaje(false); 
            setTimeout(() => {
                setMensajeConfirmacion('');
                setTipoMensaje(null);
            }, 3000);
            if (error.response?.data?.disponible) {
                setCantidad(error.response.data.disponible);
            }
        }
    };
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCategorySelect = async (categoryId) => {
        setIsMenuOpen(false);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/categoria/${categoryId}`);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
                setProductError(null);
            } else {
                console.error('La respuesta del servidor no es un array:', response.data);
                setProducts([]);
                setProductError(response.data.message || 'No hay productos con esa categoria');
            }
            setProductModalIsOpen(true);
        } catch (error) {
            setProducts([]);
            setProductError('Error al mostrar productos');
            console.error('Error al mostrar productos:', error);
        }
    };

    const closeProductModal = () => {
        setProductModalIsOpen(false);
        setProducts([]);
        setProductError(null); 
    };

    const isInCart = (productoId) => {
        return cartItems.some(item => item._id === productoId);
    };

    const [searchValue, setSearchValue] = useState("");
    const onSearchValue = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchValue(searchValue);
        if (searchValue === "") {
            setFilteredProductos(productos);
        } else {
            const filteredProductos = productos.filter((producto) => {
                return producto.nombre.toLowerCase().includes(searchValue);
            });
            setFilteredProductos(filteredProductos);
        }
    };

    return (
        <>{windowWidth > 768 ?(
        <main className='bg-white px-10 md:px-20 lg:px-40'>
            <section>
                <div className='flex justify-between items-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Productos Disponibles</h2>
                    <div className='flex space-x-4 items-center'>
                        <SearchInput searchValue={searchValue} onSearch={onSearchValue}/>
                        <button onClick={toggleMenu} className="text-teal-600">
                            {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
                        </button>
                        <Link to="/carrito-ventas" className="text-teal-600">
                            <FaShoppingCart size={30} />
                        </Link>
                        <Link to="/historial-ventas" className="text-teal-600">
                            <FaHistory size={30} /> 
                        </Link>
                        <Link to="/historial-ventas-cajeros" className="text-teal-600"> 
                            <FaFileInvoice size={30} /> 
                        </Link>
                        <Link to="/historial-pedidos-cajeros" className="text-teal-600"> 
                            <FaCalendarCheck size={30} /> 
                        </Link>
                        <button onClick={() => navigate('/cerrar-sesion')} className="text-teal-600">
                            <FaSignOutAlt size={30} />
                        </button>
                    </div>
                </div>
            </section>
            <p className='text-slate-900 my-4 text-2xl text-right'>Bienvenido - {auth?.nombre}</p>
            {isMenuOpen && (
                <section className="bg-gray-100 p-4 rounded-lg shadow-lg absolute top-16 left-0 w-full md:w-1/3 z-10">
                    <CategoryList onCategorySelect={handleCategorySelect} />
                </section>
            )}

            <section>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center'>
                    {filteredProductos.map((producto) => (
                        <div key={producto._id} className='thumb-block'>
                            <div className='text-center shadow-2xl p-10 rounded-xl my-10'>
                                <img 
                                    className='mx-auto h-40 w-40 object-cover'
                                    src={producto.imagen?.secure_url ? producto.imagen.secure_url : ''}
                                    alt={producto.nombre}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "" }}
                                />
                                <h3 className='text-lg font-medium pt-8 pb-2'>{producto.nombre}</h3>
                                <p className='text-gray-800 py-1'>{producto.descripcion}</p>
                                <p className='text-gray-800 py-1'>{producto.categoria}</p>
                                <p className='text-gray-800 py-1'>$ {producto.precio.toFixed(2)}</p>
                                {isInCart(producto._id) ? (
                                    <button onClick={() => handleUpdateCartClick(producto)} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Actualizar carrito</button>
                                ) : (
                                    <button onClick={() => handleAddToCartClick(producto)} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Añadir al carrito</button>
                                )}
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
                    <button onClick={isInCart(producto?._id) ? updateCart : addToCart} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">
                        {isInCart(producto?._id) ? 'Actualizar' : 'Agregar'}
                    </button>
                </ModalCarrito>
            )}

            {mensajeConfirmacion && (
                <div className="fixed bottom-4 right-4">
                    <Mensaje tipo={tipoMensaje}>{mensajeConfirmacion}</Mensaje>
                </div>
            )}

            {productModalIsOpen && (
                <Modal isOpen={productModalIsOpen} onRequestClose={closeProductModal} contentLabel="Productos de la Categoría">
                    <h2 className="text-xl font-bold mb-4">Productos de la Categoría</h2>
                    <button onClick={closeProductModal} className="absolute top-2 right-2 text-gray-600">X</button>
                    {productError ? (
                        <Mensaje tipo="informacion">{productError}</Mensaje>
                    ) : (
                        products.length === 0 ? (
                            <Mensaje tipo="informacion">No hay productos para esta categoría</Mensaje>
                        ) : (
                            <ul>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center'>
                                    {products.map(producto => (
                                        <div key={producto._id} className='thumb-block'>
                                            <div className='text-center shadow-2xl p-10 rounded-xl my-10'>
                                                <img
                                                    className='mx-auto h-40 w-40 object-cover'
                                                    src={producto.imagen?.secure_url ? producto.imagen.secure_url : ''}
                                                    alt={producto.nombre}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "" }}
                                                />
                                                <h3 className='text-lg font-medium pt-8 pb-2'>{producto.nombre}</h3>
                                                <p className='text-gray-800 py-1'>{producto.descripcion}</p>
                                                <p className='text-gray-800 py-1'>{producto.categoria}</p>
                                                <p className='text-gray-800 py-1'>$ {producto.precio.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ul>
                        )
                    )}
                </Modal>
            )}
        </main>
    ): (
        <>
            <div className='' style={{ alignContent: 'center', display:'-ms-flexbox', background: 'red', border: '40px solid red' }}>
                <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no esta disponible para móviles</h1>
                <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg " alt="movil" className="center" />
            </div>
        </>
    )}
    </>
)}

export default CatalogoCajero;