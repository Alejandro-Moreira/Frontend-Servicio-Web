import { Link } from 'react-router-dom'
import confirmar from '../assets/Confirmar.jpg'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Mensaje from '../componets/Alertas/Mensaje';
import { useWindowWidth } from '../hooks/useWindowWidth'



export const Confirmar = () => {

    const { token } = useParams();
    const windowWidth = useWindowWidth();
    const [mensaje, setMensaje] = useState({})
    const verifyToken = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/login/confirmar/${token}`
            const respuesta = await axios.get(url)
            setMensaje({ respuesta: respuesta.data.msg, tipo: true })
        } catch (error) {
            setMensaje({ respuesta: error.response.data.msg, tipo: false })
        }
    }
    useEffect(() => {
        verifyToken()
    }, [])

    return  windowWidth > 768 ?(

        <div className="flex flex-col items-center justify-center">

            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

            <img className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600" src={confirmar} alt="image description" />

            <div className="flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">Muchas Gracias</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">Ya puedes iniciar sesión</p>
                <Link to="/login" className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Login</Link>
            </div>

        </div>
    ): (
        <>
            <div style={{ alignContent: 'center', margin: '0 10% 5% 10%', background: 'red', border: '40px solid red' }}>
                <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no esta disponible para móviles</h1>
                <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg " alt="movil" className="center" />
            </div>
        </>
    )
}
