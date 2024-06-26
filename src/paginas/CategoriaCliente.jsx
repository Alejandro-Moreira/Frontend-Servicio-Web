import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaShoppingCart, FaHeart, FaHistory} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Mensaje from '../componets/Alertas/Mensaje';

Modal.setAppElement('#root'); // Ajuste necesario para react-modal

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [productError, setProductError] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/categoria/listar`);
        setCategories(response.data);
      } catch (error) {
        setError('Error al mostrar categorías');
        console.error('Error al mostrar categorías:', error);
      }
    };

    fetchCategories();
  }, [backendUrl]);

  const handleViewProducts = async (categoryId) => {
    try {
      const response = await axios.get(`${backendUrl}/productos/categoria/${categoryId}`);
      if (Array.isArray(response.data)) {
        setProducts(response.data);
        setProductError(null);
      } else {
        console.error('La respuesta del servidor no es un array:', response.data);
        setProducts([]);
        setProductError(response.data.message || 'Error al mostrar productos');
      }
      setModalIsOpen(true);
    } catch (error) {
      setProducts([]);
      setProductError('Error al mostrar productos');
      console.error('Error al mostrar productos:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProducts([]);
    setProductError(null); 
  };

  return (
    <div className="category-container">
      <div className="flex items-center mb-5">
        <h2 className="font-black text-4xl text-teal-600 mr-4">Categorías</h2>
        <div className="flex space-x-4">
          <button onClick={() => navigate('/catalogo')} className="text-teal-600">
            <FaArrowLeft size={30} />
          </button>
          <button onClick={() => navigate('/carrito-compra')} className="text-teal-600">
            <FaShoppingCart size={30} />
          </button>
          <button onClick={() => navigate('/favoritos')} className="text-teal-600">
            <FaHeart size={30} />
          </button>
          <button onClick={() => navigate('/historial-ventas')} className="text-teal-600">
            <FaHistory size={30} />
          </button>
        </div>
      </div>
      {error && <Mensaje tipo="error">{error}</Mensaje>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {categories.map(categoria => (
          <div
            key={categoria._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              margin: '8px',
              cursor: 'pointer',
              width: '200px',
              textAlign: 'center'
            }}
            onClick={() => handleViewProducts(categoria.categoria)}
          >
            <h3>{categoria.categoria}</h3>
          </div>
        ))}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Productos de la Categoría">
        <h2 className="text-xl font-bold mb-4">Productos de la Categoría</h2>
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">X</button>
        {
          productError ? (
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
          )

        }
      </Modal>
    </div>
  );
};

export default CategoryList;