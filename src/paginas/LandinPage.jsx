import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { FaShoppingCart, FaHeart, FaStore, FaBars, FaTimes, FaSpinner } from 'react-icons/fa';
import Modal from 'react-modal';
import ModalCarrito from '../componets/Modals/ModalCarrito';
import { SearchInput } from './Barrabusqueda';
import { getProductosListar } from "./../services/getProductosListar";
import CategoryList from './CategoriaCliente';
import Mensaje from '../componets/Alertas/Mensaje';
import { useWindowWidth } from '../hooks/useWindowWidth';

Modal.setAppElement('#root');

export const LandinPage = () => {
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
    const [loading, setLoading] = useState(true); // Estado para controlar la carga

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await getProductosListar();
                setProductos(response.data);
                setFilteredProductos(response.data);
                setLoading(false); // Una vez que se obtiene respuesta, se desactiva la carga
            } catch (error) {
                console.error('Error al obtener productos:', error);
                // En caso de error, mantenemos el estado de carga
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

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
                return (
                    producto.nombre.toLowerCase().includes(searchValue)
                );
            });
            setFilteredProductos(filteredProductos);
        }
    };

    return windowWidth > 768 ? (
        <main className='bg-white px-10 md:px-20 lg:px-0'>
            <div className="sticky top-0 z-50" style={{ backgroundColor: 'white', paddingBottom: '25px' }}>
                <div className="bg-teal-600 text-white p-4 text-center text-2xl font-bold">
                    Minimarket "Mika y Vale"
                </div>
                <section>
                    <div className='flex justify-between items-center px-20'>
                        <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>
                            Productos Disponibles
                        </h2>
                        <div className='flex space-x-4 items-center'>
                            <SearchInput searchValue={searchValue} onSearch={onSearchValue} />
                            <button onClick={toggleMenu} className="text-teal-600">
                                {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
                            </button>
                            <Link to="/login" className="text-teal-600">
                                <FaShoppingCart size={30} />
                            </Link>
                            <Link to="/login" className="text-teal-600">
                                <FaHeart size={30} />
                            </Link>
                            <Link to="/login" className="text-teal-600">
                                <FaStore size={30} />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {/* Animación de carga */}
            {loading && (
                <div className="flex justify-center items-center h-screen flex-col">
                    <FaSpinner className="animate-spin text-teal-600 text-9xl mb-4" />
                    <p className="text-4xl font-semibold text-teal-600">Cargando productos...</p>
                </div>
            )}

            {isMenuOpen && (
                <section className="bg-gray-100 p-4 rounded-lg shadow-lg absolute top-16 left-0 w-full md:w-1/3 z-10">
                    <CategoryList onCategorySelect={handleCategorySelect} />
                </section>
            )}

            {!loading && (
                <section>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center lg:px-20'>
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
                                        <>
                                            <button onClick={() => navigate("/login")} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Actualizar carrito</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => navigate("/login")} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Añadir al carrito</button>
                                        </>
                                    )}
                                    <button onClick={() => navigate("/login")} className="bg-red-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-red-800">
                                        <FaHeart size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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
                    {isInCart(producto?._id) ? (
                        <button onClick="/login" className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">
                            Actualizar
                        </button>
                    ) : (
                        <button onClick="/login" className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">
                            Agregar
                        </button>
                    )}
                </ModalCarrito>
            )}

            {mensajeConfirmacion && (
                <div className="fixed bottom-4 right-4">
                    <Mensaje tipo={tipoMensaje}>{mensajeConfirmacion}</Mensaje>
                </div>
            )}

            {productModalIsOpen && (
                <Modal isOpen={productModalIsOpen} onRequestClose={closeProductModal} contentLabel="Productos de la Categoría">
                    {productError ? (
                        <p className="text-red-600">{productError}</p>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">Productos de la Categoría</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {products.map(producto => (
                                    <div key={producto._id} className="bg-white rounded-lg shadow p-4">
                                        <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                                        <p className="text-gray-600">{producto.descripcion}</p>
                                        <p className="text-gray-800 mt-2">${producto.precio.toFixed(2)}</p>
                                        <button onClick={() => navigate("/login")} className="bg-teal-600 text-white px-4 py-2 rounded mt-4 hover:bg-teal-800">
                                            {isInCart(producto._id) ? 'Actualizar Carrito' : 'Agregar al Carrito'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <button onClick={closeProductModal} className="absolute top-2 right-2 bg-gray-200 text-gray-600 hover:bg-gray-300 px-3 py-1 rounded">
                        Cerrar
                    </button>
                </Modal>
            )}
            <footer className="bg-teal-600 text-white p-4 mt-4 sticky bottom-0">
                <div className="text-center">
                    <p>Contacto: 0967881741</p>
                    <p>Dirección: Calle Pedro de Andrade & General Florencio O'leary, Quito, Ecuador</p>
                    <p>Horario: Lunes a Viernes de 6 AM - 10 PM</p>
                </div>
            </footer>
        </main>
    ) : (
        <>
            <div style={{ alignContent: 'center', margin: '0 10% 5% 10%', background: 'red', border: '40px solid red' }}>
                <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no esta disponible para móviles</h1>
                <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg " alt="movil" className="center" />
            </div>
        </>
    );
};

export default LandinPage;