import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';

export const Register = () => {
    const [mensaje, setMensaje] = useState({});

    const [form, setform] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/login/registro`;
            const respuesta = await axios.post(url, form);
            setMensaje({ respuesta: respuesta.data.msg, tipo: true });
            setform({
                nombre: "",
                apellido: "",
                direccion: "",
                telefono: "",
                email: "",
                password: ""
            });
        } catch (error) {
            let errorMsg = "Ocurrió un error";
            if (error.response && error.response.data) {
                if (error.response.data.errors && error.response.data.errors.length > 0) {
                    errorMsg = error.response.data.errors[0].msg;
                } else if (error.response.data.msg) {
                    errorMsg = error.response.data.msg;
                }
            }
            setMensaje({ respuesta: errorMsg, tipo: false });
        }
    };

    return (
        <>
            <div className="bg-white flex justify-center items-center w-1/2">
                <div className="md:w-4/5 sm:w-full">
                    {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Bienvenidos. Aquí pueden registrarse</h1>
                    <small className="text-gray-400 block my-4 text-sm">¡Por favor! Ingrese sus datos</small>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="nombre">Nombre:</label>
                            <input type="text" id="nombre" name='nombre'
                                value={form.nombre} onChange={handleChange}
                                placeholder="Ingresa tu nombre" maxLength="30"
                                className="block w-full rounded-md border border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 py-1 px-1.5 text-gray-500" required />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="apellido">Apellido:</label>
                            <input type="text" id="apellido" name='apellido'
                                value={form.apellido} onChange={handleChange}
                                placeholder="Ingresa tu apellido" maxLength="30"
                                className="block w-full rounded-md border border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 py-1 px-1.5 text-gray-500" required />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="direccion">Dirección</label>
                            <input type="text" id="direccion" name='direccion'
                                value={form.direccion} onChange={handleChange}
                                placeholder="Ingresa tu dirección" maxLength="30"
                                className="block w-full rounded-md border border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 py-1 px-1.5 text-gray-500" required />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="telefono">Teléfono:</label>
                            <input type="tel" id="telefono" name='telefono'
                                value={form.telefono} onChange={handleChange}
                                placeholder="Ingresa tu teléfono" maxLength="10"
                                className="block w-full rounded-md border border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 py-1 px-1.5 text-gray-500" required />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="email">Email:</label>
                            <input type="email" id="email" name='email'
                                value={form.email} onChange={handleChange}
                                placeholder="Ingresa tu email" maxLength="40"
                                className="block w-full rounded-md border border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 py-1 px-1.5 text-gray-500" required />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="password">Contraseña:</label>
                            <input type="password" id="password" name='password'
                                value={form.password} onChange={handleChange}
                                placeholder="*****************" maxLength="30"
                                className="block w-full rounded-md border border-gray-300 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700 py-1 px-1.5 text-gray-500" required />
                        </div>

                        <div className="mb-3">
                            <button className="bg-gray-500 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">Registro</button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4 "></div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya tienes una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-500 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900">Login</Link>
                    </div>
                </div>
            </div>

            <div className="w-1/2 h-screen bg-[url('/images/Registro.jpeg')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>
        </>
    );
};
