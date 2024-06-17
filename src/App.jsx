import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './layout/Auth';
import Login from './paginas/Login';
import { LandinPage } from './paginas/LandinPage';
import { Register } from './paginas/Register';
import { Forgot } from './paginas/Forgot';
import { NotFound } from './paginas/NotFound';
import Pedido from './paginas/Pedidos'; 
import HistorialPedidos from './paginas/Historial'; 
import Dashboard from './layout/Dashboard';
import Listar from './paginas/Listar';
import Visualizar from './paginas/Visualizar';
import Crear from './paginas/Crear';
import Actualizar from './paginas/Actualizar';
import Perfil from './paginas/Perfil';
import { Confirmar } from './paginas/Confirmar';
import Restablecer from './paginas/Restablecer';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import PrivateRouteWithRole from './routes/PrivateRouteWithRole';
import { Catalogo } from './paginas/Catalogo';
import Categoria from './paginas/Categoria';
import { Forbidden } from './paginas/Forbidden';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<LandinPage />} />
          <Route path='/' element={<Auth />}>
            <Route path='login' element={<Login />} />
            <Route path='login/registro' element={<Register />} />
            <Route path='forgot/:id' element={<Forgot />} />
            <Route path='login/confirmar/:token' element={<Confirmar />} />
            <Route path='login/recuperar-password/:token' element={<Restablecer />} />
            <Route path='*' element={<NotFound />} />
          </Route>
          
          <Route path='dashboard/*' element={<PrivateRoute />}>
            <Route element={<Dashboard />}>
              <Route index element={<Catalogo />} />
              <Route path='crear-producto' element={<Crear />} />

              <Route path='listar' element={<Listar />} />
              <Route path='crear' element={<Crear />} />
              <Route path='actualizar/:id' element={<Actualizar />} />
              <Route path='crear-producto' element={<div>Gestión para Admin</div>} />
              <Route path='pedidos' element={<Pedido />} />
              <Route path='compras' element={<HistorialPedidos />} />
            </Route>
          </Route>

          <Route path='/forbidden' element={<Forbidden />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;