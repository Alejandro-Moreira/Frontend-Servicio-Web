import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../componets/Alertas/Mensaje';
import Modal from 'react-modal';
import { FaShoppingCart, FaBars, FaTimes, FaCalendarCheck, FaFileInvoice, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { SearchInput } from './Barrabusqueda';
import CategoryList from './CategoriaCliente';

const HistorialVentasCajero = () => {
  const { auth } = useContext(AuthContext);
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [error, setError] = useState(null);
  const [ventaDetalles, setVentaDetalles] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerHistorialVentas = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          setError('No estás autenticado');
          return;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/ventas/mostrar?cliente=${userId}`;
        const options = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(url, options);
        if (response.status === 200) {
          const ventasData = response.data;

          if (Array.isArray(ventasData)) {
            setVentas(ventasData);
            setFilteredVentas(ventasData);
          } else {
            setError('Error al obtener el historial de ventas');
          }
        } else {
          setError('Error al obtener el historial de ventas');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al obtener el historial de ventas');
      }
    };

    obtenerHistorialVentas();
  }, []);

  const handleViewVentas = async (venta) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ventas/buscar/${venta._id}?cliente=${userId}`);
      if (response.status === 200) {
        setVentaDetalles(response.data);
        setModalIsOpen(true);
      } else {
        setError('Error al obtener los detalles de la venta');
      }
    } catch (error) {
      setError('Error al obtener los detalles de la venta');
      console.error('Error al obtener los detalles de la venta', error);
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setVentaDetalles(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchValue(searchValue);
    if (searchValue === '') {
      setFilteredVentas(ventas);
    } else {
      const filtered = ventas.filter((venta) =>
        venta.cajero.toLowerCase().includes(searchValue) ||
        new Date(venta.fecha).toLocaleDateString().includes(searchValue)
      );
      setFilteredVentas(filtered);
    }
  };

  if (error) return <Mensaje tipo="error">{error}</Mensaje>;

  return (
    <main className='bg-white px-10 md:px-20 lg:px-40'>
      <section className='flex items-center justify-between'>
        <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Historial de Ventas</h2>
        <div className='flex space-x-4 items-center'>
          <SearchInput searchValue={searchValue} onSearch={onSearchValue} />
          <button onClick={() => navigate(-1)} className="text-teal-600">
            <FaArrowLeft size={30} />
          </button>
          <button onClick={() => navigate('/carrito-compra')} className="text-teal-600">
            <FaShoppingCart size={30} />
          </button>
          <button onClick={toggleMenu} className="text-teal-600">
            {isMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
          </button>
          <Link to="/historial-ventas-cajeros" className="text-teal-600">
            <FaFileInvoice size={30} />
          </Link>
          <Link to="/historial-pedidos-cajeros" className="text-teal-600">
            <FaCalendarCheck size={30} />
          </Link>
        </div>
      </section>

      {isMenuOpen && (
        <section className="bg-gray-100 p-4 rounded-lg shadow-lg absolute top-16 left-0 w-full md:w-1/3 z-10">
          <CategoryList onCategorySelect={toggleMenu} />
        </section>
      )}

      {ventas.length === 0 ? (
        <Mensaje tipo="informacion">No hay ventas en el historial.</Mensaje>
      ) : (
        <table className='w-full mt-5 table-auto shadow-lg bg-white'>
          <thead className='bg-gray-800 text-slate-400'>
            <tr>
              <th className='p-2'>N°</th>
              <th className='p-2'>Cajero</th>
              <th className='p-2'>Total</th>
              <th className='p-2'>Fecha</th>
              <th className='p-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map((venta, index) => (
              <tr key={venta._id} className="border-b hover:bg-gray-300 text-center">
                <td className='p-2'>{index + 1}</td>
                <td className='p-2'>{venta.cajero}</td>
                <td className='p-2'>${venta.total}</td>
                <td className='p-2'>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td className='p-2'>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleViewVentas(venta)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalIsOpen && ventaDetalles && (
        <Modal isOpen={modalIsOpen} onRequestClose={cerrarModal} contentLabel="Detalles de la Venta">
          <div style={styles.factura}>
            <h1>Detalles de la Venta</h1>
            <p><strong>ID:</strong> {ventaDetalles._id}</p>
            <p><strong>Cajero:</strong> {ventaDetalles.cajero}</p>
            <p><strong>Total:</strong> ${ventaDetalles.total}</p>
            <p><strong>Fecha:</strong> {new Date(ventaDetalles.fecha).toLocaleDateString()}</p>
            <table style={styles.facturaTable}>
              <thead>
                <tr>
                  <th style={styles.facturaTableTh}>Producto</th>
                  <th style={styles.facturaTableTh}>Cantidad</th>
                  <th style={styles.facturaTableTh}>Precio</th>
                  <th style={styles.facturaTableTh}>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventaDetalles.producto.map((producto, index) => (
                  <tr key={index}>
                    <td style={styles.facturaTableTd}>{producto}</td>
                    <td style={styles.facturaTableTd}>{ventaDetalles.cantidad[index]}</td>
                    <td style={styles.facturaTableTd}>${ventaDetalles.precio[index].toFixed(2)}</td>
                    <td style={styles.facturaTableTd}>${(ventaDetalles.precio[index] * ventaDetalles.cantidad[index]).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={styles.facturaTableTd}>Subtotal</td>
                  <td style={styles.facturaTableTd}>${ventaDetalles.total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={styles.facturaTableTd}><strong>Total</strong></td>
                  <td style={styles.facturaTableTd}><strong>${ventaDetalles.total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <button onClick={cerrarModal} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Cerrar</button>
          </div>
        </Modal>
      )}
    </main>
  );
};

const styles = {
  factura: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  facturaTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  facturaTableTh: {
    borderBottom: '2px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
  facturaTableTd: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
};

export default HistorialVentasCajero;