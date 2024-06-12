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
import { PrivateRoute } from './routes/PrivateRoute';
import { TratamientosProvider } from './context/TratamientosProvider';
import PrivateRouteWithRole from './routes/PrivateRouteWithRole';
import { Catalogo } from './paginas/Catalogo';
import Categoria from './paginas/Categoria';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <TratamientosProvider>
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
              <Route path='dashboard/*' element={
                <PrivateRoute>
                  <Routes>
                    <Route element={<Dashboard />}>
                      <Route index element={<Catalogo />} />

                      <Route path='actualizar/:id' element={<Actualizar />} />
                    </Route>
                  </Routes>
                </PrivateRoute>
              } />
              {/* Rutas para Pedido, Factura y HistorialPedidos */}
              <Route path='pedidos' element={<Pedido />} />
              <Route path='historial' element={<HistorialPedidos />} />
            </Routes>
          </TratamientosProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
