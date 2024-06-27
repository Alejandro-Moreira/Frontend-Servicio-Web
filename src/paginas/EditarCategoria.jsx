import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const EditarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [nombreCategoria, setNombreCategoria] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setNombreCategoria(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMensaje({ respuesta: 'No estás autenticado', tipo: false });
      return;
    }

    const formData = new FormData();
    formData.append('categoria', nombreCategoria);
    formData.append('cliente', userId);

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const url = `${backendUrl}/categoria/actualizar/${id}`;
      const respuesta = await axios.put(url, formData, options);

      if (respuesta.status === 200) {
        if(respuesta.data.message == 'Ya existe una categoría con ese nombre.'){
          setMensaje({ respuesta: 'Ya existe una categoría con ese nombre', tipo: false });
        }else{
          setMensaje({ respuesta: 'Categoría actualizada con éxito', tipo: true });
          setTimeout(() => {
            navigate('/dashboard/categoria-listar');
          }, 3000);
        }
      } else {
        setMensaje({ respuesta: respuesta.data.message, tipo: false });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMensaje({ respuesta: error.response?.data?.message || 'Hubo un error', tipo: false });
      setTimeout(() => setMensaje({}), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
      <div>
        <label htmlFor='categoriaId' className='text-gray-700 uppercase font-bold text-sm'>ID de la Categoría:</label>
        <input
          id='categoriaId'
          type="text"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='ID de la categoría'
          name='categoriaId'
          value={id}
          disabled
        />
      </div>
      <div>
        <label htmlFor='nombreCategoria' className='text-gray-700 uppercase font-bold text-sm'>Nuevo Nombre de la Categoría:</label>
        <input
          id='nombreCategoria'
          type="text"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Nuevo nombre de la categoría'
          name='nombreCategoria'
          value={nombreCategoria}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between">
        <input
          type="submit"
          className='bg-blue-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-blue-800 cursor-pointer transition-all'
          value='Actualizar Categoría'
        />
        <button
          type="button"
          className='bg-gray-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition-all'
          onClick={() => navigate('/dashboard/categoria-listar')}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarCategoria;
