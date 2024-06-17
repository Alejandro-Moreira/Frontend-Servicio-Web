import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardText, MDBBtn } from "mdb-react-ui-kit";
import AuthContext from '../context/AuthProvider'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Necesario para accesibilidad

export const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { auth, setAuth } = useContext(AuthContext); // Usar el contexto de autenticación
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products from the backend
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/listar`)
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const addToCart = (item) => {
        let updatedCartItems = [...cartItems, item];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        setModalIsOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth({});
        navigate('/login');
    };

    return (
        <MDBContainer className='bg-white px-10 md:px-20 lg:px-40'>
            <section>
                <div className='text-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Productos Disponibles</h2>
                </div>
            </section>

            <section>
                <MDBRow>
                    <MDBCol md='12'>
                        <MDBRow className='g-4'>
                            {productos.map((producto, index) => (
                                <React.Fragment key={producto._id}>
                                    <MDBCol md='3'>
                                        <MDBCard className='shadow-2xl p-10 rounded-xl my-10'>
                                            <img 
                                                className='mx-auto h-40 w-40 object-cover'
                                                src={producto.imagen?.secure_url ? producto.imagen.secure_url : 'URL_ALTERNATIVA_AQUÍ'}
                                                alt={producto.nombre}
                                                onError={(e) => {e.target.onerror = null; e.target.src="URL_ALTERNATIVA_AQUÍ"}}
                                            />
                                            <MDBCardBody>
                                                <MDBCardText className='text-gray-800 py-1'>{producto.nombre}</MDBCardText>
                                                <MDBCardText className='text-gray-800 py-1'>{producto.descripcion}</MDBCardText>
                                                <MDBCardText className='text-gray-800 py-1'>{producto.categoria}</MDBCardText>
                                                <MDBCardText className='text-gray-800 py-1'>$ {producto.precio.toFixed(2)}</MDBCardText>
                                                <MDBBtn onClick={() => addToCart(producto)} color='primary'>Comprar</MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                    {index % 4 === 3 && <div className='w-100'></div>}
                                </React.Fragment>
                            ))}
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </section>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
            >
                <h2>Carrito de Compras</h2>
                {cartItems.length === 0 ? (
                    <p>No hay productos en el carrito.</p>
                ) : (
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>{item.nombre} - $ {item.precio.toFixed(2)}</li>
                        ))}
                    </ul>
                )}
                <MDBBtn onClick={() => navigate('/cart')} color='primary'>Ir al Carrito</MDBBtn>
                <MDBBtn onClick={() => setModalIsOpen(false)} color='secondary'>Cerrar</MDBBtn>
            </Modal>
        </MDBContainer>
    );
};
