import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Mensaje from '../componets/Alertas/Mensaje';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
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

  const handleViewProducts = (categoryName) => {
    navigate(`/productos/categoria/${categoryName}`);
  };

  const favoritosLogin = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    } else {
      navigate('/favoritos');
    }
  };

  const CarritosLogin = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    } else {
      navigate('/carrito-compra');
    }
  };

  const HistorialLogin = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    } else {
      navigate('/historial-ventas');
    }
  };

  return (
    <div className="category-container">
      <div className="flex items-center mb-5">
        <h2 className="font-black text-4xl text-teal-600 mr-4">Categorías</h2>
        <div className="flex space-x-4">
          <button onClick={CarritosLogin} className="text-teal-600">
            <FaShoppingCart size={30} />
          </button>
          <button onClick={favoritosLogin} className="text-teal-600">
            <FaHeart size={30} />
          </button>
          <button onClick={HistorialLogin} className="text-teal-600">
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
    </div>
  );
};

export default CategoryList;