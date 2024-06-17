import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const PrivateRouteWithRole = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    return allowedRoles.includes(auth.rol) ? <Outlet /> : <Navigate to="/forbidden" />;
};

export default PrivateRouteWithRole;
