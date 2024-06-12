import React, { useState } from 'react';
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
    MDBCheckbox,
} from "mdb-react-ui-kit";

export const RegistroPedido = () => {
    const [clienteId, setClienteId] = useState('');
    const [comision, setComision] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const pedidoData = {
            cliente: clienteId,
            comision: comision
        };

        axios.post('/pedidos/registro', pedidoData, { withCredentials: true })
            .then(response => {
                setMessage('Pedido registrado exitosamente');
                setClienteId('');
                setComision(false);
            })
            .catch(error => {
                setMessage('Error al registrar el pedido');
                console.error('Error registering order:', error);
            });
    };

    return (
        <MDBContainer className='bg-white px-10 md:px-20 lg:px-40'>
            <section>
                <nav className='p-10 mb-12 flex justify-between'>
                    <h1 className='text-2xl font-bold'>Registrar Pedido</h1>
                    <ul className='flex items-center'>
                        <li>
                            <Link to="/logout" className='bg-gray-600 text-slate-400 px-6 py-2 rounded-full ml-8 hover:bg-gray-900 hover:text-white'>
                                Cerrar Sesión
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className='text-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Formulario de Pedido</h2>
                </div>
            </section>

            <section>
                <MDBRow>
                    <MDBCol md='12'>
                        <MDBCard className='shadow-2xl p-10 rounded-xl my-10'>
                            <MDBCardBody>
                                <form onSubmit={handleSubmit}>
                                    <MDBCardTitle className='text-lg font-medium pt-8 pb-2'>Detalles del Pedido</MDBCardTitle>
                                    <MDBCardText className='text-gray-800 py-1'>ID del Cliente</MDBCardText>
                                    <input
                                        type="text"
                                        value={clienteId}
                                        onChange={(e) => setClienteId(e.target.value)}
                                        className="form-control mb-4"
                                        placeholder="Ingrese el ID del Cliente"
                                        required
                                    />
                                    <MDBCheckbox
                                        name="comision"
                                        value=""
                                        id="comision"
                                        label="¿Desea entrega a domicilio?"
                                        checked={comision}
                                        onChange={() => setComision(!comision)}
                                    />
                                    <MDBBtn type="submit" color='primary' className='mt-4'>Registrar Pedido</MDBBtn>
                                </form>
                                {message && <p className='mt-4'>{message}</p>}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </section>
        </MDBContainer>
    );
};
