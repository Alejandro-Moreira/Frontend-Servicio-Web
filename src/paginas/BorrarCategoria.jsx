import React, { useState } from 'react';
import axios from 'axios';

const BorrarCategoria = () => {
  const [categoriaId, setCategoriaId] = useState('');

  const handleBorrar = () => {
    axios.delete(`/categoria/borrar/${categoriaId}`)
      .then(response => {
        alert('Categoría borrada con éxito');
      })
      .catch(error => {
        console.error('Error al borrar la categoría', error);
      });
  };

  return (
    <div>
      <h2>Borrar Categoría</h2>
      <input
        type="text"
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        placeholder="ID de la categoría"
      />
      <button onClick={handleBorrar}>Borrar</button>
    </div>
  );
};

export default BorrarCategoria;