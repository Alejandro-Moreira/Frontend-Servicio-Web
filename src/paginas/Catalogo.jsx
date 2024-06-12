import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBBtn,
    MDBCardTitle,
    MDBCardText,
} from "mdb-react-ui-kit";

export const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Fetch products from the backend
        axios.get('/productos/listar')
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    return (
        <MDBContainer className='bg-white px-10 md:px-20 lg:px-40'>
            <section>
                <nav className='p-10 mb-12 flex justify-between'>
                    <h1 className='text-2xl font-bold'>Minimarket "Mika y Vale"</h1>
                    <ul className='flex items-center'>
                        <li>
                            <Link to="/logout" className='bg-gray-600 text-slate-400 px-6 py-2 rounded-full ml-8 hover:bg-gray-900 hover:text-white'>
                                Cerrar Sesión
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className='text-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Productos Disponibles</h2>
                </div>
            </section>

            <section>
                <MDBRow>
                    <MDBCol md='12'>
                        <MDBRow className='g-4'>
                            {productos.map((producto, index) => (
                                <React.Fragment key={producto.id}>
                                    <MDBCol md='3'>
                                        <MDBCard className='shadow-2xl p-10 rounded-xl my-10'>
                                            <img className='mx-auto h-40 w-40' src={producto.imagen} alt={producto.nombre} />
                                            <MDBCardBody>
                                                <MDBCardTitle className='text-lg font-medium pt-8 pb-2'>{producto.nombre}</MDBCardTitle>
                                                <MDBCardText className='text-gray-800 py-1'>$ {producto.precio.toFixed(2)}</MDBCardText>
                                                <MDBBtn onClick={() => addToCart(producto)} color='primary'>Comprar</MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                    {/* Mostrar un div vacío para completar la fila si es necesario */}
                                    {index % 4 === 3 && <div className='w-100'></div>}
                                </React.Fragment>
                            ))}
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </section>
        </MDBContainer>
    );
};
