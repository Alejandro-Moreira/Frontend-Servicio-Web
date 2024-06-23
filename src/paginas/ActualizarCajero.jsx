import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

const ActualizarCajero = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    email: '',
    telefono: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCajero = async () => {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setMensaje({ respuesta: 'No estás autenticado', tipo: false });
        setLoading(false);
        return;
      }

      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/cajeros/mostrar?cliente=${userId}`;
        const { data } = await axios.get(url);
        const cajero = data.find(c => c._id === id);
        if (cajero) {
          setForm({
            email: cajero.email || '',
            telefono: cajero.telefono ? `0${cajero.telefono}` : '',
            username: cajero.username || '',
            password: '' 
          });
          setMensaje({});
        } else {
          setMensaje({ respuesta: 'Cajero no encontrado', tipo: false });
        }
      } catch (error) {
        console.error('Error al cargar el cajero:', error);
        setMensaje({ respuesta: 'Error al cargar el cajero', tipo: false });
      }
      setLoading(false);
    };

    cargarCajero();
  }, [id]);

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

    const data = {
      ...form,
      cliente: userId 
    };

    // Eliminar campos vacíos
    Object.keys(data).forEach(key => {
      if (!data[key]) {
        delete data[key];
      }
    });

    // Verificar los datos que se envían
    console.log('Datos enviados:', data);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cajeros/actualizar/${id}`; // Usar el id del cajero en la URL
      const response = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setMensaje({ respuesta: 'Cajero actualizado con éxito', tipo: true });

        // Actualizar el estado del formulario con los datos actualizados
        const cajeroActualizado = response.data.Cajero;
        setForm({
          email: cajeroActualizado.email || '',
          telefono: cajeroActualizado.telefono ? `0${cajeroActualizado.telefono}` : '',
          username: cajeroActualizado.username || '',
          password: '' // No queremos prellenar la contraseña
        });

        setTimeout(() => {
          navigate('/dashboard/cajero-listar');
        }, 3000);
      } else {
        setMensaje({ respuesta: response.data.message, tipo: false });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
      setMensaje({
        respuesta: error.response?.data?.message || 'Hubo un error',
        tipo: false,
        detalles: error.response?.data?.errors || [] // Mostrar detalles de errores si existen
      });
      setTimeout(() => setMensaje({}), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(mensaje).length > 0 && (
        <Mensaje tipo={mensaje.tipo}>
          {mensaje.respuesta}
          {mensaje.detalles && mensaje.detalles.length > 0 && (
            <ul>
              {mensaje.detalles.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          )}
        </Mensaje>
      )}
      <div>
        <label htmlFor='email' className='text-gray-700 uppercase font-bold text-sm'>Correo Electrónico:</label>
        <input
          id='email'
          type='email'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Correo electrónico'
          name='email'
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor='telefono' className='text-gray-700 uppercase font-bold text-sm'>Teléfono:</label>
        <input
          id='telefono'
          type='tel'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Teléfono'
          name='telefono'
          value={form.telefono}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor='username' className='text-gray-700 uppercase font-bold text-sm'>Nombre de Usuario:</label>
        <input
          id='username'
          type='text'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Nombre de usuario'
          name='username'
          value={form.username}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor='password' className='text-gray-700 uppercase font-bold text-sm'>Contraseña:</label>
        <input
          id='password'
          type='password'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Contraseña'
          name='password'
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className='flex justify-between'>
        <input
          type='submit'
          className='bg-blue-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-blue-800 cursor-pointer transition-all'
          value='Actualizar Cajero'
          disabled={loading}
        />
        <button
          type='button'
          className='bg-gray-600 w-1/2 p-3 text-white uppercase font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition-all'
          onClick={() => navigate('/dashboard/cajero-listar')}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ActualizarCajero;
