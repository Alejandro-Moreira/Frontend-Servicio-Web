import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Mensaje from '../componets/Alertas/Mensaje';
import AuthContext from '../context/AuthProvider';
import { useWindowWidth } from '../hooks/useWindowWidth';

const Login = () => {
    const windowWidth = useWindowWidth();
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [mensaje, setMensaje] = useState({});

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${import.meta.env.VITE_BACKEND_URL}/login`;

        try {
            const respuesta = await axios.post(url, form);
            if (respuesta.status === 200) {
                let rol = '';
                const { message, userId } = respuesta.data;
                console.log('User ID from backend:', userId);
                if (message === 'Cajero Autenticado Correctamente') {
                    rol = 'cajero';
                } else {
                    rol = form.email === 'mikayvale2024@outlook.com' ? 'admin' : 'cliente';
                }
                const nombre = respuesta.data.username;
                const token = 'dummy-token';
                // Almacenar en localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('rol', rol);
                localStorage.setItem('nombre', nombre);
                localStorage.setItem('userId', userId); // Almacenar el userId en localStorage

                // Actualizar el contexto de autenticación
                setAuth({ nombre, rol, token, userId });
                if (rol === 'admin') {
                    navigate('/dashboard');
                } else if (rol === 'cliente') {
                    navigate('/catalogo');
                } else {
                    navigate('/catalogo-cajero');
                }

            } else {
                setMensaje({ respuesta: respuesta.data.message, tipo: false });
                setForm({ email: "", password: "" });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Error en la solicitud';
            setMensaje({ respuesta: errorMsg, tipo: false });
            setForm({ email: "", password: "" });
            setTimeout(() => setMensaje({}), 3000);
        }
    };

    // Obtener el userId de localStorage cuando el componente se monta
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setAuth((prevAuth) => ({ ...prevAuth, userId: storedUserId }));
        }
    }, [setAuth]);

    return windowWidth > 768 ? (
        <>
            <div className="w-1/2 h-screen bg-[url('/images/Login.jpeg')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>
            <div className="w-1/2 h-screen bg-white flex justify-center items-center">
                <div className="md:w-4/5 sm:w-full">
                    {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Bienvenidos a "Mika y Vale"</h1>
                    <small className="text-gray-400 block my-4 text-sm">¡Por favor! Ingrese sus datos</small>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Ingresa tu email"
                                maxLength="40"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Contraseña</label>
                            <input
                                type="password"
                                name='password'
                                value={form.password}
                                onChange={handleChange}
                                placeholder="*************"
                                maxLength="30"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                            />
                        </div>

                        <div className="my-4">
                            <button className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Login</button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4">
                        <Link to="/forgot/id" className="underline text-sm text-gray-400 hover:text-gray-900">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿No tienes una cuenta?</p>
                        <Link to="/login/registro" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</Link>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <>
            <div style={{ alignContent: 'center', margin: '0 10% 5% 10%', background: 'red', border: '40px solid red' }}>
                <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no esta disponible para móviles</h1>
                <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg" alt="movil" className="center" />
            </div>
        </>
    );
};

export default Login;