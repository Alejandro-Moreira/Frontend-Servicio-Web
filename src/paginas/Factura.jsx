// src/factura.jsx
import React, { useState, useEffect } from 'react';

const Factura = () => {
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de obtención de datos
    const obtenerDatosFactura = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            id: '12345',
            cliente: 'John Doe',
            total: 150.00,
            fecha: '2024-06-05',
            detalles: [
              { nombre: 'Producto 1', precio: 50.00, cantidad: 1 },
              { nombre: 'Producto 2', precio: 100.00, cantidad: 1 }
            ]
          });
        }, 2000); // Simulando un retraso en la respuesta de 2 segundos
      });
    };

    obtenerDatosFactura()
      .then((data) => {
        setFactura(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al obtener los datos de la factura');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="factura-container">
      <h2>Factura</h2>
      <p><strong>ID:</strong> {factura.id}</p>
      <p><strong>Cliente:</strong> {factura.cliente}</p>
      <p><strong>Total:</strong> ${factura.total}</p>
      <p><strong>Fecha:</strong> {factura.fecha}</p>
      <h3>Detalles</h3>
      <ul>
        {factura.detalles.map((item, index) => (
          <li key={index}>
            {item.nombre} - ${item.precio} x {item.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Factura;