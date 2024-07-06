import React, { useState, useEffect, useContext } from 'react';
import { MdDeleteForever, MdEdit, MdAddCircleOutline } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Mensaje from '../componets/Alertas/Mensaje';
import AuthContext from '../context/AuthProvider';
import Modal from 'react-modal';
import { FaSearch } from 'react-icons/fa';

const ListarCategorias = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [productSearchValue, setProductSearchValue] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${backendUrl}/categoria/listar`);
        setCategorias(response.data);
        setFilteredCategorias(response.data);
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

  const handleViewProducts = async (categoria) => {
    try {
      const response = await axios.get(`${backendUrl}/productos/categoria/${categoria}`);
      setProductos(response.data);
      setFilteredProductos(response.data);
      setModalIsOpen(true);
    } catch (error) {
      setError('Error al obtener los productos');
      console.error('Error al obtener los productos', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProductos([]);
    setFilteredProductos([]);
  };

  const onSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchValue(searchValue);
    if (searchValue === '') {
      setFilteredCategorias(categorias);
    } else {
      const filtered = categorias.filter(categoria =>
        categoria.categoria.toLowerCase().includes(searchValue)
      );
      setFilteredCategorias(filtered);
    }
  };

  const onProductSearchValue = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setProductSearchValue(searchValue);
    if (searchValue === '') {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchValue)
      );
      setFilteredProductos(filtered);
    }
  };

  return (
    <div className="my-5">
      <h1 className="font-black text-4xl text-gray-500 mb-5 text-center">Lista de Categorías</h1>
      {error && <Mensaje tipo="error">{error}</Mensaje>}
      <div className="text-center mb-4">
        <button className='bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-800 flex items-center mx-auto' onClick={handleCreate}>
          <MdAddCircleOutline className="h-7 w-7 mr-2" /> Crear Categoría
        </button>
      </div>
      <div className="flex items-center mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchValue}
          onChange={onSearchValue}
          maxLength="30"
          className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          style={{ width: '400px' }}
        />
        <FaSearch className="ml-3 text-gray-500" />
      </div>
      {
        filteredCategorias.length === 0
          ? <Mensaje tipo="informacion">No existen registros</Mensaje>
          : <table className='w-full mt-5 table-auto shadow-lg bg-white'>
            <thead className='bg-gray-800 text-slate-400'>
              <tr>
                <th className='p-2'>N°</th>
                <th className='p-2'>Categoría</th>
                <th className='p-2'>Ver Productos</th>
                <th className='p-2 text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredCategorias.map((categoria, index) => (
                  <tr className="border-b hover:bg-gray-300 text-center" key={categoria._id}>
                    <td className='p-2' title={categoria._id}>{index + 1}</td>
                    <td className='p-2'>{categoria.categoria}</td>
                    <td className='p-2'>
                      <button className='bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-800' onClick={() => handleViewProducts(categoria.categoria)}>
                        Ver Productos
                      </button>
                    </td>
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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Productos de la Categoría">
        <h2 className="text-xl font-bold mb-4">Productos de la Categoría</h2>
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">X</button>
        <div className="flex items-center mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre de producto"
            value={productSearchValue}
            onChange={onProductSearchValue}
            maxLength="30"
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <FaSearch className="ml-3 text-gray-500" />
        </div>
        {
          filteredProductos.length === 0
            ? <Mensaje tipo="informacion">No hay productos para esta categoría</Mensaje>
            : <ul>
              {filteredProductos.map(producto => (
                <li key={producto._id} className="border-b p-2">
                  {producto.nombre}
                </li>
              ))}
            </ul>
        }
      </Modal>
    </div>
  );
};

export default ListarCategorias;