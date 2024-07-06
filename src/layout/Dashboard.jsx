import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { useWindowWidth } from '../hooks/useWindowWidth'

const Dashboard = () => {
    const location = useLocation();
    const windowWidth = useWindowWidth();
    const urlActual = location.pathname;
    const { auth } = useContext(AuthContext);
    const autenticado = localStorage.getItem('token');

    const renderLinks = () => {
        switch (auth.rol) {
            case 'admin':
                return (
                    <>
                        <li className="text-center">
                            <Link to='/dashboard/listar-producto' className={`${urlActual === '/dashboard/listar-producto' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Productos</Link>
                        </li>
                        <li className="text-center">
                            <Link to='/dashboard/categoria-listar' className={`${urlActual === '/dashboard/categoria-listar' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Categorías</Link>
                        </li>
                        <li className="text-center">
                            <Link to='/dashboard/cajero-listar' className={`${urlActual === '/dashboard/cajero-listar' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Cajeros</Link>
                        </li>
                        <li className="text-center">
                            <Link to='/dashboard/historial-pedidos' className={`${urlActual === '/dashboard/historial-pedidos' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Pedidos</Link>
                        </li>
                        <li className="text-center">
                            <Link to='/dashboard/historial-ventas' className={`${urlActual === '/dashboard/historial-ventas' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Ventas</Link>
                        </li>
                    </>
                );
            default:
                return null;
        }
    };

    return windowWidth > 768 ? (
        <div className='md:flex md:min-h-screen'>
            <div className='md:w-1/5 bg-gray-800 px-5 py-4'>
                <h2 className='text-4xl font-black text-center text-slate-200'>Minimarket "Mika y Vale"</h2>

                <img src="https://img.freepik.com/vector-premium/administrador-pagina_313674-6634.jpg" alt="img-client" className="m-auto mt-8 p-1 border-2 border-slate-500 rounded-full" width={120} height={120} />
                <p className='text-slate-400 text-center my-4 text-sm'><span className='bg-green-600 w-3 h-3 inline-block rounded-full'></span> Bienvenido - {auth?.nombre}</p>
                <p className='text-slate-400 text-center my-4 text-sm'>Rol - {auth?.rol}</p>
                <hr className="mt-5 border-slate-500" />

                <ul className="mt-5">
                    <li className="text-center">
                        <Link to='/dashboard' className={`${urlActual === '/dashboard' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Catalogo</Link>
                    </li>
                    {renderLinks()}
                </ul>
            </div>

            <div className='flex-1 flex flex-col justify-between h-screen bg-gray-100'>
                <div className='bg-gray-800 py-2 flex md:justify-end items-center gap-5 justify-center'>
                    <div className='text-md font-semibold text-slate-100'>
                        Bienvenido - {auth?.nombre}
                    </div>
                    <div>
                        <img src="https://static.vecteezy.com/system/resources/previews/023/883/491/non_2x/business-person-icon-cool-vector.jpg" alt="img-client" className="border-2 border-green-600 rounded-full" width={50} height={50} />
                    </div>
                    <div>
                        <Link to='cerrar-sesion' className="text-white mr-3 text-md block hover:bg-red-900 text-center bg-red-800 px-4 py-1 rounded-lg">
                            Salir
                        </Link>
                    </div>
                </div>
                <div className='overflow-y-scroll p-8'>
                    {autenticado ? <Outlet /> : <Navigate to="/login" />}
                </div>
                <div className='bg-gray-800 h-12'>
                    <p className='text-center text-slate-100 leading-[2.9rem] underline'>Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    ) : (
        <>
            <div style={{ alignContent: 'center', margin: '0 10% 5% 10%', background: 'red', border: '40px solid red' }}>
                <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no esta disponible para móviles</h1>
                <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg " alt="movil" className="center" />
            </div>
        </>
    )
}

export default Dashboard;