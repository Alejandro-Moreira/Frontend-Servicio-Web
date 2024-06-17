import React, { useState } from 'react';
import axios from 'axios';

const EditarCategoria = () => {
  const [categoriaId, setCategoriaId] = useState('');
  const [nombreCategoria, setNombreCategoria] = useState('');

  const handleActualizar = () => {
    axios.put(`/categoria/actualizar/${categoriaId}`, { categoria: nombreCategoria })
      .then(response => {
        alert('Categoría actualizada con éxito');
      })
      .catch(error => {
        console.error('Error al actualizar la categoría', error);
      });
  };

  return (
    <div>
      <h2>Actualizar Categoría</h2>
      <input
        type="text"
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        placeholder="ID de la categoría"
      />
      <input
        type="text"
        value={nombreCategoria}
        onChange={(e) => setNombreCategoria(e.target.value)}
        placeholder="Nuevo nombre de la categoría"
      />
      <button onClick={handleActualizar}>Actualizar</button>
    </div>
  );
};

export default EditarCategoria;
