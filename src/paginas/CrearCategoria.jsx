import React, { useState } from 'react';
import axios from 'axios';

const CrearCategoria = () => {
  const [nombreCategoria, setNombreCategoria] = useState('');

  const handleRegistrar = () => {
    axios.post('/categoria/registro', { categoria: nombreCategoria })
      .then(response => {
        alert('Categoría registrada con éxito');
      })
      .catch(error => {
        console.error('Error al registrar la categoría', error);
      });
  };

  return (
    <div>
      <h2>Registrar Categoría</h2>
      <input
        type="text"
        value={nombreCategoria}
        onChange={(e) => setNombreCategoria(e.target.value)}
        placeholder="Nombre de la categoría"
      />
      <button onClick={handleRegistrar}>Registrar</button>
    </div>
  );
};

export default CrearCategoria;
