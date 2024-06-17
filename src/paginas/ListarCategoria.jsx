import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListarCategorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get('/categoria/listar')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las categorías', error);
      });
  }, []);

  return (
    <div>
      <h2>Lista de Categorías</h2>
      <ul>
        {categorias.map(categoria => (
          <li key={categoria._id}>{categoria.categoria}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListarCategorias;
