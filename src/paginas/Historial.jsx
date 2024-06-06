// src/historialPedidos.jsx
import React, { useState, useEffect } from 'react';

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de obtención de datos
    const obtenerDatosHistorial = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            { id: '12345', estado: 'Pagado', total: 150.00, fecha: '2024-06-05' },
            { id: '12346', estado: 'Enviado', total: 200.00, fecha: '2024-06-04' },
            { id: '12347', estado: 'En preparación', total: 75.00, fecha: '2024-06-03' }
          ]);
        }, 2000); // Simulando un retraso en la respuesta de 2 segundos
      });
    };

    obtenerDatosHistorial()
      .then((data) => {
        setPedidos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al obtener el historial de pedidos');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="historial-container">
      <h2>Historial de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos en el historial.</p>
      ) : (
        <ul>
          {pedidos.map((pedido, index) => (
            <li key={index}>
              <p><strong>ID:</strong> {pedido.id}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <p><strong>Fecha:</strong> {pedido.fecha}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialPedidos;
