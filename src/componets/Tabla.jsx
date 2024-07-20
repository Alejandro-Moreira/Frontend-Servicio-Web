import { useContext, useEffect, useState } from "react";
import { MdDeleteForever, MdInfo } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthProvider";

const Tabla = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const listarProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos/listar`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const respuesta = await axios.get(url, options);
            setProductos(respuesta.data);
            setFilteredProductos(respuesta.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmar = confirm("¿Estás seguro de que deseas eliminar este producto?");
            if (confirmar) {
                const token = localStorage.getItem('token');
                const url = `${import.meta.env.VITE_BACKEND_URL}/productos/borrar/${id}`;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(url, options);
                listarProductos();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onSearchValue = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchValue(searchValue);
        if (searchValue === '') {
            setFilteredProductos(productos);
        } else {
            const filtered = productos.filter(producto =>
                producto.nombre.toLowerCase().includes(searchValue)
            );
            setFilteredProductos(filtered);
        }
    };

    useEffect(() => {
        listarProductos();
    }, []);

    return (
        <>
            <div className="flex items-center mb-5">
                <input
                    type="text"
                    placeholder="Buscar por nombre de producto..."
                    value={searchValue}
                    onChange={onSearchValue}
                    maxLength="30"
                    className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    style={{ width: '400px' }}
                />
                <FaSearch className="ml-3 text-gray-500" />
            </div>
            {
                filteredProductos.length === 0
                    ? <Mensaje tipo={'active'}>{'No existen registros'}</Mensaje>
                    : <table className='w-full mt-5 table-auto shadow-lg bg-white'>
                        <thead className='bg-gray-800 text-slate-400'>
                            <tr>
                                <th className='p-2'>N°</th>
                                <th className='p-2'>Nombre</th>
                                <th className='p-2'>Categoría</th>
                                <th className='p-2'>Precio</th>
                                <th className='p-2'>Cantidad</th>
                                <th className='p-2'>Descripción</th>
                                <th className='p-2'>Imagen</th>
                                <th className='p-2'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredProductos.map((producto, index) => (
                                    <tr className="border-b hover:bg-gray-300 text-center" key={producto._id}>
                                        <td>{index + 1}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.categoria}</td>
                                        <td>{producto.precio}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>{producto.descripcion}</td>
                                        <td>
                                            {producto.imagen && <img src={producto.imagen.secure_url} alt={producto.nombre} className="w-20 h-20 object-cover" />} {/* Mostrar imagen */}
                                        </td>
                                        <td className='py-2 text-center'>
                                            {
                                                auth.rol === "admin" && (
                                                    <>
                                                        <MdInfo
                                                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                            onClick={() => navigate(`/dashboard/actualizar-producto/${producto._id}`)}
                                                        />
                                                        <MdDeleteForever
                                                            className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                                                            onClick={() => navigate(`/dashboard/eliminar-producto/${producto._id}`)}
                                                        />
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
        </>
    );
};

export default Tabla;
