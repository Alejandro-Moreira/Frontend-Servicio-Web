import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const BorrarCajero = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [email, setEmail] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMensaje({ respuesta: 'No estás autenticado', tipo: false });
      return;
    }
    
    try {
      const url = `${backendUrl}/cajeros/eliminar/${cajero._id}?cliente=${userId}`;
      const response = await axios.delete(url, {
        data: { email, cliente: userId },
      });

      if (response.status === 200) {
        setMensaje({ respuesta: 'Cajero borrado con éxito', tipo: true });
        setEmail('');
        setTimeout(() => {
          navigate('/dashboard/cajero-listar');
        }, 3000);
      } else {
        setMensaje({ respuesta: response.data.message, tipo: false });
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
        <label htmlFor='email' className='text-gray-700 uppercase font-bold text-sm'>Email del Cajero:</label>
        <input
          id='email'
          type="email"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Email del cajero'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <input
          type="submit"
          className='bg-red-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-red-800 cursor-pointer transition-all'
          value='Borrar Cajero'
        />
        <button
          type="button"
          className='bg-gray-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition-all'
          onClick={() => navigate('/dashboard/cajero-listar')}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default BorrarCajero;
