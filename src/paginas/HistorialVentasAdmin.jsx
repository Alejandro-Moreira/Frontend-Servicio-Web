import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../componets/Alertas/Mensaje'; 
import ModalVentas from '../componets/Modals/ModalHistorialVentas';

const HistorialVentas = () => {
  const { auth } = useContext(AuthContext);
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [ventaDetalles, setVentaDetalles] = useState(null); 

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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ventas/cajeros/${venta._id}?cliente=${userId}`);
      if (response.status === 200) {
        setVentaDetalles(response.data);
      } else {
        setError('Error al obtener los detalles de la venta');
      }
    } catch (error) {
      setError('Error al obtener los detalles de la venta');
      console.error('Error al obtener los detalles de la venta', error);
    }
  };

  const cerrarModal = () => {
    setVentaDetalles(null);
  };

  if (error) return <Mensaje tipo="error">{error}</Mensaje>;

  return (
    <div className="historial-container">
      <h2 className="font-black text-4xl text-gray-500 mb-5">Historial de Ventas</h2>
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
            {ventas.map((venta, index) => (
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
      {ventaDetalles && (
        <ModalVentas onClose={cerrarModal}>
          <h2 className="text-2xl font-bold mb-4">Detalles de la Venta</h2>
          <p><strong>ID:</strong> {ventaDetalles._id}</p>
          <p><strong>Cajero:</strong> {ventaDetalles.cajero}</p>
          <p><strong>Total:</strong> ${ventaDetalles.total}</p>
          <p><strong>Fecha:</strong> {new Date(ventaDetalles.fecha).toLocaleDateString()}</p>
          <p><strong>Productos:</strong></p>
          <ul>
            {ventaDetalles.producto.map((producto, index) => (
              <li key={index}>{producto}</li>
            ))}
          </ul>
          <p><strong>Cantidad:</strong></p>
          <ul>
            {ventaDetalles.cantidad.map((cant, index) => (
              <li key={index}>{cant}</li>
            ))}
          </ul>
        </ModalVentas>
      )}
    </div>
  );
};

export default HistorialVentas;