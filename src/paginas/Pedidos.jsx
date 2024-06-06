// src/OrderStatus.js
import React, { useState } from 'react';

const OrderStatus = () => {
  const [status, setStatus] = useState('En preparación');
  const [notification, setNotification] = useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = () => {
    // Cambio de estado en el backend
    setNotification(`El estado del pedido se ha actualizado a: ${status}`);
  };

  return (
    <div>
      <h2>Cambiar Estado del Pedido</h2>
      <select value={status} onChange={handleChange}>
        <option value="En preparación">En preparación</option>
        <option value="Enviado">Enviado</option>
        <option value="Pagado">Pagado</option>
      </select>
      <button onClick={handleSubmit}>Actualizar Estado</button>
      {notification && <p>{notification}</p>}
    </div>
  );
};

export default OrderStatus;
