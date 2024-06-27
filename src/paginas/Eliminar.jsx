import React, { useState, useEffect, useContext } from 'react';
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const EliminarProducto = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState({});
    const [productoAEliminar, setProductoAEliminar] = useState(null);

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
        } catch (error) {
            console.log(error);
            setMensaje({ respuesta: 'Hubo un error al obtener los productos', tipo: false });
        }
    };

    const confirmarEliminacion = (producto) => {
        setProductoAEliminar(producto);
    };

    const handleDelete = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMensaje({ respuesta: 'No estás autenticado', tipo: false });
            return;
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos/borrar/${productoAEliminar._id}`;
            const respuesta = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: { cliente: userId }
            });

            if (respuesta.status === 200) {
                setProductos(productos.filter(producto => producto._id !== productoAEliminar._id));
                setMensaje({ respuesta: 'Producto eliminado con éxito', tipo: true });
                setProductoAEliminar(null);
                setTimeout(() => {
                    navigate('/dashboard/listar-producto');
                }, 3000);
            } else {
                setMensaje({ respuesta: respuesta.data.message, tipo: false });
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            setMensaje({ respuesta: 'Hubo un error al eliminar el producto', tipo: false });
        }
    };

    const cancelarEliminacion = () => {
        setProductoAEliminar(null);
    };

    useEffect(() => {
        listarProductos();
    }, []);

    return (
        <>
            <h1 className="font-black text-4xl text-gray-500">Eliminar Productos</h1>
            <hr className="my-4" />
            <p className="mb-8">Este módulo te permite eliminar productos.</p>
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
            {
                productos.length === 0
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
                                productos.map((producto, index) => (
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
                                                        {productoAEliminar && productoAEliminar._id === producto._id ? (
                                                            <>
                                                                <button
                                                                    onClick={handleDelete}
                                                                    className="bg-red-600 text-white px-4 py-2 rounded mr-2"
                                                                >
                                                                    Confirmar
                                                                </button>
                                                                <button
                                                                    onClick={cancelarEliminacion}
                                                                    className="bg-gray-600 text-white px-4 py-2 rounded"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <MdDeleteForever
                                                                className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                                                                onClick={() => confirmarEliminacion(producto)}
                                                            />
                                                        )}
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

export default EliminarProducto;