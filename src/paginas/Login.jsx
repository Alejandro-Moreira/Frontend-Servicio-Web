// Importacion de axios
import axios from 'axios'
// Importacion de useState useContext
import { useState, useContext } from 'react'
// Importacion de Link para realizar la navegacion 
import { Link } from 'react-router-dom'
// Importacion de useNavigate para realizar la navegacion 
import { useNavigate } from 'react-router-dom'
// Importacion de Mensaje para los mensajes de alerta
import Mensaje from '../componets/Alertas/Mensaje'
// Importacion el grupo de Whatsapp
import AuthContext from '../context/AuthProvider'

const Login = () => {
    // Instancia de useNavigate()
    const navigate = useNavigate()
    // Leer el contenido del mensaje del provider
    const { setAuth, setEstado } = useContext(AuthContext)
    // usestate 
    const [mensaje, setMensaje] = useState({})

    // usestate para capturar los datos del email y password
    const [form, setform] = useState({
        email: "",
        password: ""
    })

    // Capturar los datos en el formulario y almacenar en las variables
    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = form.password.includes("vet")
            ? `${import.meta.env.VITE_BACKEND_URL}/paciente/login`
            : `${import.meta.env.VITE_BACKEND_URL}/login`
        try {
            const respuesta = await axios.post(url, form)
            localStorage.setItem('token', respuesta.data.token) // guardar token en el localstorage
            setAuth(respuesta.data)
            navigate('/dashboard')
        } catch (error) {
            setMensaje({ respuesta: error.response.data.msg, tipo: false })
            setform({})
            setTimeout(() => {
                setMensaje({})
            }, 3000);
        }
    }



    return (
        <>
            <div className="w-1/2 h-screen bg-[url('/images/Login.jpeg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div>

            <div className="w-1/2 h-screen bg-white flex justify-center items-center">

                <div className="md:w-4/5 sm:w-full">
                    {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500">Bienvenidos a "Mika y Vale"</h1>
                    <small className="text-gray-400 block my-4 text-sm">¡Por favor! Ingrese sus datos</small>


                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Email</label>
                            <input type="email"
                                name='email'
                                value={form.email || ""} onChange={handleChange}
                                placeholder="Ingresa tu email" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500" />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold">Contraseña</label>
                            <input type="password"
                                name='password'
                                value={form.password || ""} onChange={handleChange}
                                placeholder="*************" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500" />
                        </div>

                        <div className="my-4">
                            <button className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Login</button>
                        </div>

                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4 ">
                        <Link to="/forgot/id" className="underline text-sm text-gray-400 hover:text-gray-900">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿No tienes una cuenta?</p>
                        <Link to="/login/registro" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</Link>

                    </div>


                </div>
            </div>
        </>
    )
}

export default Login