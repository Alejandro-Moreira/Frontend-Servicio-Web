import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../componets/Alertas/Mensaje';
import Modal from 'react-modal';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HistorialPedidos = () => {
  const { auth } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [pedidoDetalles, setPedidoDetalles] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const obtenerHistorialPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('No estás autenticado');
        return;
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/pedidos/admin/mostrar?cliente=${userId}`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(url, options);
      if (response.status === 200) {
        const pedidosData = response.data;

        if (Array.isArray(pedidosData)) {
          setPedidos(pedidosData);
          setFilteredPedidos(pedidosData);
        } else {
          setError('No hay pedidos en el historial');
        }
      } else {
        setError('No hay pedidos en el historial');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('No hay pedidos en el historial');
    }
  };

  useEffect(() => {
    obtenerHistorialPedidos();
  }, []);

  const handleViewPedidos = async (pedido) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ventas/cliente/${pedido._id}?cliente=${userId}`);
      if (pedido.estado === 'En espera') {
        pedido.estado = 'En preparación'
        setPedidoDetalles(pedido);
        setPedidos(prevPedidos => prevPedidos.map(p => p._id === pedido._id ? { ...p, estado: 'En preparación' } : p));
      }else{
        setPedidoDetalles(pedido);
      }
      setModalIsOpen(true);
    } catch (error) {
      setError('Error al obtener los productos');
      console.error('Error al obtener los productos', error);
    }
  };

  const handleChangeEnviado = async (pedido) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ventas/cliente/enviado/${pedido._id}?cliente=${userId}`);
      if (pedido.estado === 'En preparación') {
        setPedidos(prevPedidos => prevPedidos.map(p => p._id === pedido._id ? { ...p, estado: 'Enviado' } : p));
        setFilteredPedidos(prevPedidos => prevPedidos.map(p => p._id === pedido._id ? { ...p, estado: 'Enviado' } : p));
      }
    } catch (error) {
      setError('Error al cambiar el estado');
      console.error('Error al cambiar el estado', error);
    }
  };

  const handleChangePagado = async (pedido) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ventas/cliente/pagado/${pedido._id}?cliente=${userId}`);
      if (pedido.estado === 'Enviado') {
        setPedidos(prevPedidos => prevPedidos.map(p => p._id === pedido._id ? { ...p, estado: 'Pagado' } : p));
        setFilteredPedidos(prevPedidos => prevPedidos.map(p => p._id === pedido._id ? { ...p, estado: 'Pagado' } : p));
      }
    } catch (error) {
      setError('Error al cambiar el estado');
      console.error('Error al cambiar el estado', error);
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setPedidoDetalles(null);
  };

  const onSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchValue(searchValue);
    if (searchValue === '') {
      setFilteredPedidos(pedidos);
    } else {
      const filtered = pedidos.filter((pedido) =>
        pedido.nombre.toLowerCase().includes(searchValue) ||
        new Date(pedido.fecha).toLocaleDateString().includes(searchValue) ||
        pedido.direccion.toLowerCase().includes(searchValue) ||
        pedido.estado.toLowerCase().includes(searchValue)
      );
      setFilteredPedidos(filtered);
    }
  };

  const obtenerComision = (comision) => {
    if (comision) return 0.5;
    else return 0;
  };

  const subtotal = (comision, total) => {
    if (comision) return total - 0.5;
    else return total;
  };

  if (error) return <Mensaje tipo="error">{error}</Mensaje>;

  return (
    <div className="historial-container">
      <h2 className="font-black text-4xl text-gray-500 mb-5">Historial de Pedidos</h2>
      <div className="flex items-center mb-5">
        <button onClick={() => navigate(-1)} className="text-teal-600 mr-3">
          <FaArrowLeft size={30} />
        </button>
        <input
          type="text"
          placeholder="Buscar por cliente, fecha, dirección o estado..."
          value={searchValue}
          onChange={onSearchValue}
          className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          style={{ width: '400px' }}
        />
        <FaSearch className="ml-3 text-gray-500" />
      </div>
      {pedidos.length === 0 ? (
        <Mensaje tipo="informacion">No hay pedidos en el historial.</Mensaje>
      ) : (
        <table className='w-full mt-5 table-auto shadow-lg bg-white'>
          <thead className='bg-gray-800 text-slate-400'>
            <tr>
              <th className='p-2'>N°</th>
              <th className='p-2'>Cliente</th>
              <th className='p-2'>Total</th>
              <th className='p-2'>Fecha</th>
              <th className='p-2'>Dirección</th>
              <th className='p-2'>Estado</th>
              <th className='p-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido, index) => (
              <tr key={pedido._id} className="border-b hover:bg-gray-300 text-center">
                <td className='p-2'>{index + 1}</td>
                <td className='p-2'>{pedido.nombre}</td>
                <td className='p-2'>${pedido.total}</td>
                <td className='p-2'>{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td className='p-2'>{pedido.direccion}</td>
                <td className='p-2'>{pedido.estado}</td>
                <td className='p-2'>
                <button
                    className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleViewPedidos(pedido)}
                  >
                    Ver
                  </button>
                  {pedido.estado === 'En preparación' && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleChangeEnviado(pedido)}
                    >
                      Cambiar Estado
                    </button>
                  )}
                  {pedido.estado === 'Enviado' && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleChangePagado(pedido)}
                    >
                      Cambiar Estado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalIsOpen && pedidoDetalles && (
        <Modal isOpen={modalIsOpen} onRequestClose={cerrarModal} contentLabel="Detalles del Pedido">
          <div style={styles.factura}>
            <h1>Detalles del Pedido</h1>
            <p><strong>ID:</strong> {pedidoDetalles._id}</p>
            <p><strong>Cliente:</strong> {pedidoDetalles.nombre}</p>
            <p><strong>Dirección:</strong> {pedidoDetalles.direccion}</p>
            <p><strong>Fecha:</strong> {new Date(pedidoDetalles.fecha).toLocaleDateString()}</p>
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
                {pedidoDetalles.producto.map((producto, index) => (
                  <tr key={index}>
                    <td style={styles.facturaTableTd}>{producto}</td>
                    <td style={styles.facturaTableTd}>{pedidoDetalles.cantidad[index]}</td>
                    <td style={styles.facturaTableTd}>${pedidoDetalles.precio[index].toFixed(2)}</td>
                    <td style={styles.facturaTableTd}>${(pedidoDetalles.precio[index] * pedidoDetalles.cantidad[index]).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={styles.facturaTableTd}>Subtotal</td>
                  <td style={styles.facturaTableTd}>${subtotal(pedidoDetalles.comision, pedidoDetalles.total).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={styles.facturaTableTd}>Comisión</td>
                  <td style={styles.facturaTableTd}>${obtenerComision(pedidoDetalles.comision).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={styles.facturaTableTd}><strong>Total</strong></td>
                  <td style={styles.facturaTableTd}><strong>${pedidoDetalles.total.toFixed(2)}</strong></td>
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

export default HistorialPedidos;