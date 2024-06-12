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

export const Favoritos = () => {
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        // Fetch favorites from the backend
        axios.get('/favoritos/listar', { withCredentials: true })
            .then(response => {
                setFavoritos(response.data);
            })
            .catch(error => {
                console.error('Error fetching favorites:', error);
            });
    }, []);

    const handleRemoveFavorito = (id) => {
        axios.delete(`/favoritos/borrar/${id}`, { withCredentials: true })
            .then(response => {
                // Remove the favorite from the state
                setFavoritos(favoritos.filter(favorito => favorito.id !== id));
            })
            .catch(error => {
                console.error('Error deleting favorite:', error);
            });
    };

    return (
        <MDBContainer className='bg-white px-10 md:px-20 lg:px-40'>
            <section>
                <nav className='p-10 mb-12 flex justify-between'>
                    <h1 className='text-2xl font-bold'>Mis Favoritos</h1>
                    <ul className='flex items-center'>
                        <li>
                            <Link to="/logout" className='bg-gray-600 text-slate-400 px-6 py-2 rounded-full ml-8 hover:bg-gray-900 hover:text-white'>
                                Cerrar Sesión
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className='text-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Favoritos</h2>
                </div>
            </section>

            <section>
                <MDBRow>
                    <MDBCol md='12'>
                        <MDBRow className='g-4'>
                            {favoritos.map((favorito, index) => (
                                <React.Fragment key={favorito.id}>
                                    <MDBCol md='3'>
                                        <MDBCard className='shadow-2xl p-10 rounded-xl my-10'>
                                            <img className='mx-auto h-40 w-40' src={favorito.imagen} alt={favorito.nombre} />
                                            <MDBCardBody>
                                                <MDBCardTitle className='text-lg font-medium pt-8 pb-2'>{favorito.nombre}</MDBCardTitle>
                                                <MDBCardText className='text-gray-800 py-1'>$ {favorito.precio.toFixed(2)}</MDBCardText>
                                                <MDBBtn onClick={() => handleRemoveFavorito(favorito.id)} color='danger'>Eliminar</MDBBtn>
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
