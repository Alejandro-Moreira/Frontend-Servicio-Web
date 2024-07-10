import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const BorrarCajero = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleDelete = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMensaje({ respuesta: 'No estás autenticado', tipo: false });
      return;
    }

    try {
      const url = `${backendUrl}/cajeros/eliminar/${id}`;
      const response = await axios.delete(url, {
        data: { cliente: userId },
      });

      if (response.status === 200) {
        setMensaje({ respuesta: 'Cajero borrado con éxito', tipo: true });
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

  const handleCancel = () => {
    navigate('/dashboard/cajero-listar');
  };

  return (
    <div className="my-5">
      {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
      <div className="text-center">
        <h2 className='text-gray-700 uppercase font-bold text-lg mb-5'>¿Seguro que quieres eliminar el cajero?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            className='bg-red-600 w-1/4 p-3 text-white uppercase font-bold rounded-lg hover:bg-red-800 cursor-pointer transition-all'
          >
            Borrar Cajero
          </button>
          <button
            onClick={handleCancel}
            className='bg-gray-600 w-1/4 p-3 text-white uppercase font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition-all'
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};


export default BorrarCajero;
