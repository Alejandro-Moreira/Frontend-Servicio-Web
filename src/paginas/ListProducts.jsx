import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Mensaje from '../componets/Alertas/Mensaje';
import ModalCarrito from '../componets/Modals/ModalCarrito';
import AuthContext from '../context/AuthProvider';
import { SearchInput } from './Barrabusqueda';

const ListProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [producto, setProducto] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(null);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/productos/categoria/${categoryId}`);
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else if (response.data && response.data.message) {
          setProducts([]);
          setError(response.data.message);
        } else {
          setProducts([]);
          setError('Error: La respuesta de la API no es un array');
        }
      } catch (error) {
        setError('Error al mostrar productos');
        console.error('Error al mostrar productos:', error);
      }
    };

    fetchProducts();
  }, [backendUrl, categoryId]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const handleAddToCartClick = (producto) => {
    setProducto(producto);
    setCantidad(1);
    setModalIsOpen(true);
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/pedidos/agregar`, {
        cliente: auth.userId,
        producto: producto._id,
        cantidad: cantidad,
      });

      const updatedCartItems = cartItems.some(item => item._id === producto._id)
        ? cartItems.map(item => item._id === producto._id ? { ...item, cantidad: item.cantidad + cantidad } : item)
        : [...cartItems, { ...producto, cantidad }];

      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setMensajeConfirmacion('Producto añadido con éxito');
      setTipoMensaje(true); // Mensaje de éxito
      setTimeout(() => {
        setMensajeConfirmacion('');
        setTipoMensaje(null);
      }, 3000);
      setModalIsOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al añadir producto';
      setMensajeConfirmacion(errorMessage);
      setTipoMensaje(false); // Mensaje de error
      setTimeout(() => {
        setMensajeConfirmacion('');
        setTipoMensaje(null);
      }, 3000);
      if (error.response?.data?.disponible) {
        setCantidad(error.response.data.disponible);
      }
    }
  };

  const isInCart = (productoId) => {
    return cartItems.some(item => item._id === productoId);
  };

  const onSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchValue(searchValue);
    if (searchValue === '') {
      setFilteredProducts(products);
    } else {
      const filteredProducts = products.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchValue)
      );
      setFilteredProducts(filteredProducts);
    }
  };

  return (
    <main className='bg-white px-10 md:px-20 lg:px-40'>
      <section className='flex items-center justify-between'>
        <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Productos</h2>
        <div className='flex space-x-4 items-center'>
          <SearchInput searchValue={searchValue} onSearch={onSearchValue} />
          <button onClick={() => navigate(-1)} className="text-teal-600">
            <FaArrowLeft size={30} />
          </button>
        </div>
      </section>

      {error && <Mensaje tipo="error">{error}</Mensaje>}
      <section>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center'>
          {filteredProducts.length === 0 ? (
            <Mensaje tipo="informacion">No hay productos para esta categoría</Mensaje>
          ) : (
            filteredProducts.map((producto) => (
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
                  <button
                    onClick={() => handleAddToCartClick(producto)}
                    className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800"
                  >
                    {isInCart(producto._id) ? 'Actualizar carrito' : 'Añadir al carrito'}
                  </button>
                </div>
              </div>
            ))
          )}
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
          <button onClick={addToCart} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">
            {isInCart(producto?._id) ? 'Actualizar' : 'Agregar'}
          </button>
        </ModalCarrito>
      )}

      {mensajeConfirmacion && (
        <div className="fixed bottom-4 right-4">
          <Mensaje tipo={tipoMensaje}>{mensajeConfirmacion}</Mensaje>
        </div>
      )}
    </main>
  );
};

export default ListProducts;