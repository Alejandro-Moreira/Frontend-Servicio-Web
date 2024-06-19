import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const ActualizarCajero = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    email: '',
    telefono: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMensaje({ respuesta: 'No estás autenticado', tipo: false });
      return;
    }

    if (!form.id || !form.email || !form.telefono || !form.username || !form.password) {
      setMensaje({ respuesta: 'Todos los campos son obligatorios', tipo: false });
      return;
    }

    const data = {
      ...form,
      cliente: userId
    };

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cajeros/actualizar`;
      const response = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setMensaje({ respuesta: 'Cajero actualizado con éxito', tipo: true });
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
        <label htmlFor='email' className='text-gray-700 uppercase font-bold text-sm'>Correo Electrónico:</label>
        <input
          id='email'
          type="email"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Correo electrónico'
          name='email'
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='telefono' className='text-gray-700 uppercase font-bold text-sm'>Teléfono:</label>
        <input
          id='telefono'
          type="tel"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Teléfono'
          name='telefono'
          value={form.telefono}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='username' className='text-gray-700 uppercase font-bold text-sm'>Nombre de Usuario:</label>
        <input
          id='username'
          type="text"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Nombre de usuario'
          name='username'
          value={form.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='password' className='text-gray-700 uppercase font-bold text-sm'>Contraseña:</label>
        <input
          id='password'
          type="password"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Contraseña'
          name='password'
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between">
        <input
          type="submit"
          className='bg-blue-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-blue-800 cursor-pointer transition-all'
          value='Actualizar Cajero'
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

export default ActualizarCajero;