import React, { useState, useEffect, useContext } from 'react';
import { MdDeleteForever, MdEdit, MdAddCircleOutline } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const ListarCategorias = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${backendUrl}/categoria/listar`);
        setCategorias(response.data);
      } catch (error) {
        setError('Error al obtener las categorías');
        console.error('Error al obtener las categorías', error);
      }
    };

    fetchCategorias();
  }, [backendUrl]);

  const handleCreate = () => {
    navigate('/dashboard/categoria-registro');
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/categoria-actualizar/${id}`);
  };

  const handleDelete = (id) => {
    navigate(`/dashboard/categoria-borrar/${id}`);
  };

  return (
    <div className="my-5">
      <h1 className="font-black text-4xl text-gray-500 mb-5 text-center">Lista de Categorías</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="text-center mb-4">
        <button className='bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-800 flex items-center mx-auto' onClick={handleCreate}>
          <MdAddCircleOutline className="h-7 w-7 mr-2" /> Crear Categoría
        </button>
      </div>
      {
        categorias.length === 0
          ? <div className="alert alert-info">No existen registros</div>
          : <table className='w-full mt-5 table-auto shadow-lg bg-white'>
              <thead className='bg-gray-800 text-slate-400'>
                <tr>
                  <th className='p-2'>N°</th>
                  <th className='p-2'>Categoría</th>
                  <th className='p-2 text-center'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  categorias.map((categoria, index) => (
                    <tr className="border-b hover:bg-gray-300 text-center" key={categoria._id}>
                      <td className='p-2' title={categoria._id}>{index + 1}</td>
                      <td className='p-2'>{categoria.categoria}</td>
                      <td className='py-2 text-center'>
                        {
                          auth.rol === "admin" && (
                            <>
                              <button className='btn btn-warning btn-sm mx-1' onClick={() => handleEdit(categoria._id)}>
                                <MdEdit className="h-7 w-7 text-slate-800" />
                              </button>
                              <button className='btn btn-danger btn-sm mx-1' onClick={() => handleDelete(categoria._id)}>
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

export default ListarCategorias;