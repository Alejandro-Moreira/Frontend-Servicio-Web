import React from 'react';
import { FaShoppingCart, FaHeart, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Mensaje from '../componets/Alertas/Mensaje';

const FavoriteCategoryList = ({ categoriasFavoritas, onCategorySelect }) => {
  const navigate = useNavigate();

  const handleViewProducts = (categoryName) => {
    navigate(`/categorias-favoritos/${categoryName}`);
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

  const renderFavoritosIcon = () => {
    const userRole = localStorage.getItem('rol');
    if (userRole === 'cliente') {
      return (
        <button onClick={favoritosLogin} className="text-teal-600">
          <FaHeart size={30} />
        </button>
      );
    }
    return null; 
  };

  return (
    <div className="category-container">
      <div className="flex items-center mb-5">
        <h2 className="font-black text-4xl text-teal-600 mr-4">Categorías Favoritas</h2>
        <div className="flex space-x-4">
          <button onClick={CarritosLogin} className="text-teal-600">
            <FaShoppingCart size={30} />
          </button>
          {renderFavoritosIcon()}
          <button onClick={HistorialLogin} className="text-teal-600">
            <FaHistory size={30} />
          </button>
        </div>
      </div>
      {categoriasFavoritas.length === 0 && <Mensaje tipo="informacion">No hay categorías favoritas</Mensaje>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {categoriasFavoritas.map(categoria => (
          <div
            key={categoria}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              margin: '8px',
              cursor: 'pointer',
              width: '200px',
              textAlign: 'center'
            }}
            onClick={() => {
              handleViewProducts(categoria);
              onCategorySelect();
            }}
          >
            <h3>{categoria}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteCategoryList;