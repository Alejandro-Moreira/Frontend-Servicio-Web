import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const PrivateRoute = () => {
    const { auth } = useContext(AuthContext);
    const autenticado = localStorage.getItem('token');

    return autenticado ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
