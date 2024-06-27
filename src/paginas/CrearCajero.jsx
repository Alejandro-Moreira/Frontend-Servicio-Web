import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const CrearCajero = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    telefono: ''
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

    const formData = new FormData();
    formData.append('cliente', userId);

    for (const key in form) {
      formData.append(key, form[key]);
    }

    const options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cajeros/registro`;
      const respuesta = await axios.post(url, formData, options);

      if (respuesta.status === 200) {
        if(respuesta.data.msg == 'Lo sentimos, ese email ya se encuentra registrado en los clientes'){
          setMensaje({ respuesta: 'Ese correo ya se encuentra registrado', tipo: false });
        }else if(respuesta.data.msg == 'Lo sentimos, el telefono celular ya se encuentra registrado en los clientes'){
          setMensaje({ respuesta: 'Ese telefono ya se encuentra registrado', tipo: false });
        }else{
          setMensaje({ respuesta: 'Cajero registrado con éxito', tipo: true });
          setTimeout(() => {
            navigate('/dashboard/cajero-listar');
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


      <input
        type="submit"
        className='bg-gray-600 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all'
        value='Registrar Cajero'
      />
    </form>
  );
};

export default CrearCajero;
