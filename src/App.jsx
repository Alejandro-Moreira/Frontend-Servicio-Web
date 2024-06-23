import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './layout/Auth';
import Login from './paginas/Login';
import { LandinPage } from './paginas/LandinPage';
import { Register } from './paginas/Register';
import { Forgot } from './paginas/Forgot';
import { NotFound } from './paginas/NotFound';
import Pedido from './paginas/Pedidos'; 
import HistorialPedidosAdmin from './paginas/HistorialPedidosAdmin'; 
import HistorialVentasAdmin from './paginas/HistorialVentasAdmin';
import Dashboard from './layout/Dashboard';
import Listar from './paginas/Listar';
import Crear from './paginas/Crear';
import ActualizarProducto from './paginas/Actualizar';
import Eliminar from './paginas/Eliminar';
import Perfil from './paginas/Perfil';
import { Confirmar } from './paginas/Confirmar';
import Restablecer from './paginas/Restablecer';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import Productos from './paginas/Productos'
import { Catalogo } from './paginas/Catalogo';
import Categoria from './paginas/Categoria';
import ListarCategorias from './paginas/ListarCategoria';
import EditarCategoria from './paginas/EditarCategoria';
import CrearCategoria from './paginas/CrearCategoria';
import BorrarCategoria from './paginas/BorrarCategoria';
import MostrarCajeros from './paginas/ListarCajero';
import ActualizarCajero from './paginas/ActualizarCajero'
import CrearCajero from './paginas/CrearCajero';
import BorrarCajero from './paginas/BorrarCajero';
import { Forbidden } from './paginas/Forbidden';
import CierreSesion from './paginas/CerrarSesion';
import SessionTimeout from './paginas/SesionTimeout';

function App() {
  const TIMEOUT_DURATION = 5 * 60 * 1000; 
  return (
    <BrowserRouter>
      <AuthProvider>
      <SessionTimeout timeout={TIMEOUT_DURATION}>
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
              <Route index element={<Productos />} />
              <Route path='crear-producto' element={<Crear />} />
              <Route path='listar-producto' element={<Listar />} />
              <Route path='actualizar-producto/:id' element={<ActualizarProducto />} />
              <Route path='eliminar-producto/:id' element={<Eliminar />} />
              <Route path='categoria-listar' element={<ListarCategorias />} />
              <Route path='categoria-actualizar/:id' element={<EditarCategoria />} />
              <Route path='categoria-registro' element={<CrearCategoria />} />
              <Route path='categoria-borrar/:id' element={<BorrarCategoria />} />
              <Route path='cajero-listar' element={<MostrarCajeros />} />
              <Route path='cajero-actualizar/:id' element={<ActualizarCajero />} />
              <Route path='cajero-registro' element={<CrearCajero />} />
              <Route path='cajero-borrar' element={<BorrarCajero />} />
              <Route path='historial-pedidos' element={<HistorialPedidosAdmin />} />
              <Route path='historial-ventas' element={<HistorialVentasAdmin />} />
              <Route path="cerrar-sesion" element={<CierreSesion />} />


              <Route path='pedidos' element={<Pedido />} />
            </Route>
          </Route>

          <Route path='/forbidden' element={<Forbidden />} />
        </Routes>
        </SessionTimeout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
