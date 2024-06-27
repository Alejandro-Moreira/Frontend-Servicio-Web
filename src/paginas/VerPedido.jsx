import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Mensaje from '../componets/Alertas/Mensaje';

const VerPedido = () => {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(null);
    
    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await axios.get(`${baseUrl}/pedidos/${id}`);
                if (response.data.message) {
                    setMensaje(response.data.message);
                    setTipoMensaje(false);
                } else {
                    setPedido(response.data[0]);
                    setMensaje('');
                    setTipoMensaje(null);
                }
            } catch (error) {
                setMensaje('Error al mostrar el pedido del cliente');
                setTipoMensaje(false);
            }
        };

        fetchPedido();
    }, [id]);

    const calcularSubtotal = (precios, cantidades) => {
        return precios.reduce((acc, precio, index) => acc + (precio * cantidades[index]), 0);
    };

    const obtenerComision = (comision) => {
        if (typeof comision === 'number') {
            return comision;
        }
        return comision ? 0.5 : 0;
    };
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Detalles del Pedido</h1>
            {mensaje && <Mensaje tipo={tipoMensaje}>{mensaje}</Mensaje>}
            {pedido && (
                <div style={styles.pedidoContainer}>
                    <h2 style={styles.subheader}>Pedido ID: {pedido._id}</h2>
                    <p><strong>Cliente:</strong> {pedido.nombre}</p>
                    <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                    <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                    <div style={styles.productList}>
                        <h3 style={styles.subheader}>Productos:</h3>
                        <div style={styles.tableHeader}>
                            <span style={styles.columnHeader}>Producto</span>
                            <span style={styles.columnHeader}>Cantidad</span>
                            <span style={styles.columnHeader}>Precio</span>
                            <span style={styles.columnHeader}>Valor a Pagar</span>
                        </div>
                        <ul style={styles.list}>
                            {pedido.producto.map((producto, index) => (
                                <li key={index} style={styles.item}>
                                    <span style={styles.column}>{producto}</span>
                                    <span style={styles.column}>{pedido.cantidad[index]}</span>
                                    <span style={styles.column}>${pedido.precio[index].toFixed(2)}</span>
                                    <span style={styles.column}>${(pedido.precio[index] * pedido.cantidad[index]).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div style={styles.footer}>
                            <div style={styles.footerItem}>
                                <span style={styles.footerLabel}>Subtotal:</span>
                                <span style={styles.footerValue}>${calcularSubtotal(pedido.precio, pedido.cantidad).toFixed(2)}</span>
                            </div>
                            <div style={styles.footerItem}>
                                <span style={styles.footerLabel}>Comisión:</span>
                                <span style={styles.footerValue}>${obtenerComision(pedido.comision).toFixed(2)}</span>
                            </div>
                            <div style={styles.footerItem}>
                                <span style={styles.footerLabel}>Total:</span>
                                <span style={styles.footerValue}>${pedido.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
    },
    subheader: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    pedidoContainer: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    productList: {
        marginTop: '20px',
    },
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        backgroundColor: '#ddd',
        borderRadius: '5px',
    },
    columnHeader: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    column: {
        flex: 1,
        textAlign: 'center',
    },
    footer: {
        marginTop: '20px',
        borderTop: '2px solid #ddd',
        paddingTop: '10px',
    },
    footerItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
    },
    footerLabel: {
        fontWeight: 'bold',
    },
    footerValue: {
        fontWeight: 'bold',
    },
};
export default VerPedido;