import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../componets/Alertas/Mensaje';
import Modal from 'react-modal';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HistorialVentas = () => {
  const { auth } = useContext(AuthContext);
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [error, setError] = useState(null);
  const [ventaDetalles, setVentaDetalles] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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

        const url = `${import.meta.env.VITE_BACKEND_URL}/ventas/admin/mostrar?cliente=${userId}`;
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
            setError('No hay ventas en el historial');
          }
        } else {
          setError('No hay ventas en el historial');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No hay ventas en el historial');
      }
    };

    obtenerHistorialVentas();
  }, []);

  const handleViewVentas = async (venta) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ventas/cajeros/${venta._id}?cliente=${userId}`);
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
    <div className="historial-container">
      <h2 className="font-black text-4xl text-gray-500 mb-5">Historial de Ventas</h2>
      <div className="flex items-center mb-5">
        <button onClick={() => navigate(-1)} className="text-teal-600 mr-3">
          <FaArrowLeft size={30} />
        </button>
        <input
          type="text"
          placeholder="Buscar por cajero o fecha"
          value={searchValue}
          onChange={onSearchValue}
          maxLength="30"
          className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          style={{ width: '400px' }}
        />
        <FaSearch className="ml-3 text-gray-500" />
      </div>
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
            <button onClick={cerrarModal} style={{ marginLeft: '590px' }} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cerrar</button>
          </div>
        </Modal>
      )}
    </div>
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

export default HistorialVentas;