import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './layout/Auth';
import Login from './paginas/Login';
import { LandinPage } from './paginas/LandinPage';
import { Register } from './paginas/Register';
import { Forgot } from './paginas/Forgot';
import { NotFound } from './paginas/NotFound';
import HistorialPedidosAdmin from './paginas/HistorialPedidosAdmin'; 
import HistorialVentasAdmin from './paginas/HistorialVentasAdmin';
import Dashboard from './layout/Dashboard';
import Listar from './paginas/Listar';
import Crear from './paginas/Crear';
import ActualizarProducto from './paginas/Actualizar';
import Eliminar from './paginas/Eliminar';
import { Confirmar } from './paginas/Confirmar';
import Restablecer from './paginas/Restablecer';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import Productos from './paginas/Productos'
import  {Catalogo}  from './paginas/Catalogo';
import CategoryList from './paginas/CategoriaCliente';
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
import CarritoDeCompras from './paginas/Carrito';
import { Favoritos } from './paginas/Favoritos';
import HistorialPedidos from './paginas/HistorialPedidosCliente';
import VerPedido from './paginas/VerPedido';
import HistorialVentasCajero from './paginas/HistorialVentasCajero';
import { CatalogoCajero } from './paginas/CatalogoCajero';
import CarritoDeVentas from './paginas/CarritoVentas'
import ListProducts from './paginas/ListProducts';

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
          {/*Administrador*/}
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
            </Route>
          </Route>
          {/*Cliente*/}
              <Route path='catalogo' element={<Catalogo/>}/>
              <Route path='carrito-compra' element={<CarritoDeCompras/>}/>
              <Route path='favoritos' element={<Favoritos/>}/>
              <Route path='categorias' element={<CategoryList />} />  
              <Route path='productos/categoria/:categoryId' element={<ListProducts />} /> 
              <Route path='historial-pedidos' element={<HistorialPedidos/>}/>
              <Route path="cerrar-sesion" element={<CierreSesion />} />
              <Route path="/pedidos/:id" element={<VerPedido />} />
          {/*Cajero*/}
              <Route path='catalogo-cajero' element={<CatalogoCajero/>}/>
              <Route path='carrito-ventas' element={<CarritoDeVentas/>}/>
              <Route path='categorias' element={<CategoryList />} />   
              <Route path='productos/categoria/:categoryId' element={<ListProducts />} /> 
              <Route path='historial-ventas' element={<HistorialVentasCajero/>}/>
              <Route path='historial-ventas-cajeros' element={<HistorialVentasAdmin/>}/>
              <Route path='historial-pedidos-cajeros' element={<HistorialPedidosAdmin/>}/>
              <Route path="cerrar-sesion" element={<CierreSesion />} />
          <Route path='/forbidden' element={<Forbidden />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
