import React, { useState } from 'react';
import axios from 'axios';

const BuscarCajero = () => {
  const [cajeroId, setCajeroId] = useState('');
  const [cajero, setCajero] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // URL del backend desde la variable de entorno

  const handleBuscar = async () => {
    try {
      const response = await axios.get(`${backendUrl}/cajeros/buscar/${cajeroId}`);
      setCajero(response.data);
      setMensaje('Cajero encontrado');
    } catch (error) {
      setError('Error al buscar el cajero');
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <div>
      <h2>Buscar Cajero</h2>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="text"
        value={cajeroId}
        onChange={(e) => setCajeroId(e.target.value)}
        placeholder="ID del cajero"
        maxLength="30"
      />
      <button onClick={handleBuscar}>Buscar</button>
      {cajero && (
        <div>
          <h3>Detalles del Cajero</h3>
          <p>ID: {cajero._id}</p>
          <p>Nombre: {cajero.nombre}</p>
        </div>
      )}
    </div>
  );
};

export default BuscarCajero;