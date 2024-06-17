import { Outlet, Navigate, useLocation } from 'react-router-dom';

const Auth = () => {
    const location = useLocation();
        // Obtener el token
    const autenticado = localStorage.getItem('token');

    return (
        <main className="flex justify-center content-center w-full h-screen">
             {/* Si el usuario tiene token entonces navega a la ruta dashboard
        caso contrario navega al login */}
            {autenticado ? (
                location.pathname === '/dashboard' ? (
                    <Outlet />
                ) : (
                    <Navigate to='/dashboard' />
                )
            ) : (
                <Outlet />
            )}
        </main>
    );
}

export default Auth;
