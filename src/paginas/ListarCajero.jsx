import React, { useEffect, useState, useContext } from 'react';
import { MdDeleteForever, MdEdit, MdAddCircleOutline } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../componets/Alertas/Mensaje';

const MostrarCajeros = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cajeros, setCajeros] = useState([]);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCajeros = async () => {
      const userId = localStorage.getItem('userId');
      const url = `${backendUrl}/cajeros/mostrar?cliente=${userId}`;
      console.log('Fetching cajeros from URL:', url);

      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setCajeros(response.data);
      } catch (error) {
        setError('Error al obtener los cajeros');
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

    fetchCajeros();
  }, [backendUrl]);

  const handleDelete = async (id) => {
    try {
      const confirmar = confirm("¿Estás seguro de que deseas eliminar este cajero?");
      if (confirmar) {
        const userId = localStorage.getItem('userId');
        const url = `${backendUrl}/cajeros/borrar/${id}`;
        await axios.delete(url, {
          data: { cliente: userId }
        });
        setCajeros(cajeros.filter(cajero => cajero._id !== id));
      }
    } catch (error) {
      console.log(error);
      setError('Error al eliminar el cajero');
    }
  };

  const handleCreate = () => {
    navigate('/dashboard/cajero-registro');
  };

  return (
    <div className="my-5">
      <h1 className="font-black text-4xl text-gray-500 mb-5 text-center">Lista de Cajeros</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="text-center mb-4">
        <button className='bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-800 flex items-center mx-auto' onClick={handleCreate}>
          <MdAddCircleOutline className="h-7 w-7 mr-2" /> Crear Cajero
        </button>
      </div>
      {
        cajeros.length === 0
          ? <Mensaje tipo={'active'}>{'No existen registros'}</Mensaje>
          : <table className='w-full mt-5 table-auto shadow-lg bg-white'>
              <thead className='bg-gray-800 text-slate-400'>
                <tr>
                  <th className='p-2'>N°</th>
                  <th className='p-2'>Nombre</th>
                  <th className='p-2'>Email</th>
                  <th className='p-2'>Teléfono</th>
                  <th className='p-2'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  cajeros.map((cajero, index) => (
                    <tr className="border-b hover:bg-gray-300 text-center" key={cajero._id}>
                      <td className='p-2'>{index + 1}</td>
                      <td className='p-2'>{cajero.username}</td>
                      <td className='p-2'>{cajero.email}</td>
                      <td className='p-2'>{`0${cajero.telefono}`}</td>
                      <td className='py-2 text-center'>
                        {
                          auth.rol === "admin" && (
                            <>
                              <button className='btn btn-warning btn-sm mx-1' onClick={() => navigate(`/dashboard/cajero-actualizar/${cajero._id}`)}>
                                <MdEdit className="h-7 w-7 text-slate-800" />
                              </button>
                              <button className='btn btn-danger btn-sm mx-1' onClick={() => handleDelete(cajero._id)}>
                                <MdDeleteForever className="h-7 w-7 text-red-900" />
                              </button>
                            </>
                          )
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
      }
    </div>
  );
};

export default MostrarCajeros;