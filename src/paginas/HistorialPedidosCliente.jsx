import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaList, FaHeart } from 'react-icons/fa';
import Mensaje from '../componets/Alertas/Mensaje';
import Modal from '../componets/Modals/ModalHistorialPedido';


const HistorialPedidos = () => {
  const { auth } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [pedidoDetalles, setPedidoDetalles] = useState(null); // Para el modal
  const navigate = useNavigate();

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
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pedidos/buscar/${pedido._id}?cliente=${userId}`);
      setPedidoDetalles(pedido);
    } catch (error) {
      setError('Error al obtener los productos');
      console.error('Error al obtener los productos', error);
    }
  };

  const cerrarModal = () => {
    setPedidoDetalles(null);
  };
  const canShowError = !!pedidos && pedidos?.length === 0;

  useEffect(() => {
    setError(!!pedidos)
  }, [pedidos, error])


  console.log(!!pedidos, (!canShowError) && !error, "a");
  return (
      <main className='bg-white px-10 md:px-20 lg:px-40'>
      <section className='flex items-center justify-between'>
        <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Historial de Pedidos</h2>
        <div className='flex space-x-4'>
          <button onClick={() => navigate('/catalogo')} className="text-teal-600">
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
      {error && <Mensaje tipo="exito">Pedidos encontrados</Mensaje>}
      {(!canShowError) && !error ? (
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
            {pedidos.map((pedido, index) => (
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
      {pedidoDetalles && (
        <Modal onClose={cerrarModal}>
          <h2 className="text-2xl font-bold mb-4">Detalles del Pedido</h2>
          <p><strong>ID:</strong> {pedidoDetalles._id}</p>
          <p><strong>Cliente:</strong> {pedidoDetalles.nombre}</p>
          <p><strong>Dirección:</strong> {pedidoDetalles.direccion}</p>
          <p><strong>Fecha:</strong> {new Date(pedidoDetalles.fecha).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {pedidoDetalles.estado}</p>
          <p><strong>Productos:</strong></p>
          <p><strong>Total:</strong> ${pedidoDetalles.total}</p>
          <ul>
            {pedidoDetalles.producto.map((producto, index) => (
              <li key={index}>{producto}</li>
            ))}
          </ul>
          <p><strong>Cantidad:</strong></p>
          <ul>
            {pedidoDetalles.cantidad.map((cant, index) => (
              <li key={index}>{cant}</li>
            ))}
          </ul>
        </Modal>
      )}
    </main>
  );
};

export default HistorialPedidos;