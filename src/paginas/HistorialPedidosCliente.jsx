import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaList, FaHeart } from 'react-icons/fa';
import Mensaje from '../componets/Alertas/Mensaje';
import Modal from 'react-modal';
import { SearchInput } from './Barrabusqueda';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HistorialPedidos = () => {
  const { auth } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [pedidoDetalles, setPedidoDetalles] = useState(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const obtenerHistorialPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          setError('No estás autenticado');
          return;
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/pedidos/mostrar?cliente=${userId}`;
        const options = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(url, options);

        if (response.status === 200) {
          setPedidos(response.data);
          setFilteredPedidos(response.data);
        } else {
          setError('Error al obtener el historial de pedidos');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al obtener el historial de pedidos');
      }
    };

    obtenerHistorialPedidos();
  }, []);

  const handleViewPedidos = async (pedido) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pedidos/buscar/${pedido._id}?cliente=${userId}`);
      setPedidoDetalles(pedido);
      setModalIsOpen(true);
    } catch (error) {
      showMessage('Error al obtener los productos', false);
      console.error('Error al obtener los productos', error);
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setPedidoDetalles(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchValue(searchValue);
    if (searchValue === '') {
      setFilteredPedidos(pedidos);
    } else {
      const filtered = pedidos.filter((pedido) =>
        pedido.estado.toLowerCase().includes(searchValue) ||
        new Date(pedido.fecha).toLocaleDateString().includes(searchValue)
      );
      setFilteredPedidos(filtered);
    }
  };

  const showMessage = (message, isSuccess) => {
    setMensajeConfirmacion(message);
    setTimeout(() => {
      setMensajeConfirmacion('');
    }, 3000);
  };

  const canShowError = !!pedidos && pedidos?.length === 0;

  const obtenerComision = (comision) => {
    if(comision) return 0.5
    else if (!comision) return 0
  }

  const subtotal = (comision, subtotal) => {
    if(comision) return subtotal - 0.5
    else if (!comision) return subtotal
  }

  useEffect(() => {
    setError(!!pedidos);
  }, [pedidos, error]);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(20);
    doc.text("Factura", 105, 20, null, null, 'center');
    doc.setFontSize(20);
    doc.text("Minimarket 'Mika y Vale'", 105, 30, null, null, 'center');

    // Datos de la factura
    doc.setFontSize(13);
    doc.text(`ID: ${pedidoDetalles._id}`, 20, 50);
    doc.text(`Cliente: ${pedidoDetalles.nombre}`, 20, 60);
    doc.text(`Dirección: ${pedidoDetalles.direccion}`, 20, 70);
    doc.text(`Fecha: ${new Date(pedidoDetalles.fecha).toLocaleDateString()}`, 20, 80);
    
    // Tabla de productos
    const products = pedidoDetalles.producto.map((producto, index) => [
      producto,
      pedidoDetalles.cantidad[index],
      `$${pedidoDetalles.precio[index].toFixed(2)}`,
      `$${(pedidoDetalles.precio[index] * pedidoDetalles.cantidad[index]).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [['Producto', 'Cantidad', 'Precio Unidad', 'Total']],
      body: products,
      startY: 100,
      theme: 'grid',
      headStyles: { fillColor: [60, 141, 188] },
      styles: { halign: 'center' },
      columnStyles: { 0: { halign: 'left' }, 3: { halign: 'right' } }
    });

    // Totales
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Subtotal: $${subtotal(pedidoDetalles.comision, pedidoDetalles.total).toFixed(2)}`, 170, finalY);
    doc.text(`Comisión: $${obtenerComision(pedidoDetalles.comision).toFixed(2)}`, 170, finalY + 10);
    doc.text(`Total: $${pedidoDetalles.total.toFixed(2)}`, 170, finalY + 20);

    doc.save("Factura.pdf");
  };

  return (
    <main className='bg-white px-10 md:px-20 lg:px-40'>
      <section className='flex items-center justify-between'>
        <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Historial de Pedidos</h2>
        <div className='flex space-x-4 items-center'>
          <SearchInput searchValue={searchValue} onSearch={onSearchValue} />
          <button onClick={() => navigate(-1)} className="text-teal-600">
            <FaArrowLeft size={30} />
          </button>
          <button onClick={() => navigate('/carrito-compra')} className="text-teal-600">
            <FaShoppingCart size={30} />
          </button>
          <button onClick={() => navigate('/categorias')} className="text-teal-600">
            <FaList size={30} />
          </button>
          <button onClick={() => navigate('/favoritos')} className="text-teal-600">
            <FaHeart size={30} />
          </button>
        </div>
      </section>

      {mensajeConfirmacion && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded ${mensajeConfirmacion.includes('éxito') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {mensajeConfirmacion}
        </div>
      )}
      {canShowError && !error ? (
        <Mensaje tipo="informacion">No hay pedidos en el historial.</Mensaje>
      ) : (
        <table className='w-full mt-5 table-auto shadow-lg bg-white'>
          <thead className='bg-gray-800 text-slate-400'>
            <tr>
              <th className='p-2'>N°</th>
              <th className='p-2'>Cliente</th>
              <th className='p-2'>Dirección</th>
              <th className='p-2'>Total</th>
              <th className='p-2'>Fecha</th>
              <th className='p-2'>Estado</th>
              <th className='p-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido, index) => (
              <tr key={pedido._id} className="border-b hover:bg-gray-300 text-center">
                <td className='p-2'>{index + 1}</td>
                <td className='p-2'>{pedido.nombre}</td>
                <td className='p-2'>{pedido.direccion}</td>
                <td className='p-2'>${pedido.total}</td>
                <td className='p-2'>{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td className='p-2'>{pedido.estado}</td>
                <td className='p-2'>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleViewPedidos(pedido)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalIsOpen && pedidoDetalles && (
        <Modal isOpen={modalIsOpen} onRequestClose={cerrarModal} contentLabel="Detalles de la Venta">
          <div style={styles.factura}>
            <h1>Detalles de la Venta</h1>
            <p><strong>ID:</strong> {pedidoDetalles._id}</p>
            <p><strong>Cliente:</strong> {pedidoDetalles.nombre}</p>
            <p><strong>Dirección:</strong> {pedidoDetalles.direccion}</p>
            <p><strong>Fecha:</strong> {new Date(pedidoDetalles.fecha).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> {pedidoDetalles.estado}</p>
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
            <button onClick={downloadPDF} style={{ marginLeft: '10px' }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Descargar PDF</button>
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

export default HistorialPedidos;