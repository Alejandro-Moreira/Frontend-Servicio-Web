import { useContext, useEffect, useState } from "react";
import { MdDeleteForever, MdNoteAdd, MdInfo } from "react-icons/md";
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";
import JSConfetti from 'js-confetti';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthProvider";

const Tabla = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti();
    const [productos, setProductos] = useState([]);

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

    useEffect(() => {
        listarProductos();
    }, []);

    return (
        <>
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
                                                        <MdInfo
                                                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                                                            onClick={() => navigate(`/dashboard/actualizar-producto/${producto._id}`)}
                                                        />

                                                        <MdDeleteForever className="h-7 w-7 text-red-900 cursor-pointer inline-block"
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