import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Mensaje from '../componets/Alertas/Mensaje';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaArrowLeft } from 'react-icons/fa';

const CarritoDeCompras = () => {
    const [cartItems, setCartItems] = useState([]);
    const [pedidoId, setPedidoId] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [entrega, setEntrega] = useState('local'); 
    const [mostrarFactura, setMostrarFactura] = useState(false);
    const [factura, setFactura] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (userId) {
            listarProductosPedido();
        }
    }, [userId]);

    const listarProductosPedido = async () => {
        try {
            const response = await axios.get(`${baseUrl}/pedidos/listar?cliente=${userId}`);
            const pedido = response.data.Pedido;
            const pedidoId = Object.keys(pedido)[0];
            const productos = pedido[pedidoId];
            setPedidoId(pedidoId);
            setCartItems(productos.filter(item => item.Producto));
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al listar los productos del pedido');
            setTipoMensaje(false);
        }
    };

    const borrarProductoPedido = async (producto) => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${baseUrl}/pedidos/borrar/${producto.idProducto}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { cliente: userId },
            });
            setMensaje(response.data.message);
            setTipoMensaje(true);
            listarProductosPedido();
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al borrar el producto del pedido');
            setTipoMensaje(false);
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const abrirModal = () => {
        setModalIsOpen(true);
    };

    const cerrarModal = () => {
        setModalIsOpen(false);
    };

    const finalizarPedido = () => {
        abrirModal();
    };

    const procesarPedido = async () => {
        try {
            const response = await axios.post(`${baseUrl}/pedidos/registro`, {
                cliente: userId,
                comision: entrega === 'casa'
            });

            setMensaje(response.data.message);
            setTipoMensaje(true);

            if (response.data.Pedido && response.data.Pedido.length > 0) {
                const pedidoData = response.data.Pedido[0];
                const factura = {
                    fecha: new Date().toLocaleDateString(),
                    items: cartItems,
                    total: pedidoData.Total,
                    entrega,
                    nombreCliente: pedidoData.NombreCliente,
                    direccion: entrega === 'casa' ? 'Dirección de entrega' : 'Retiro en local'
                };

                setFactura(factura);
                setMostrarFactura(true);
            } else {
                setMensaje('No se pudo obtener la información del pedido.');
                setTipoMensaje(false);
            }

            cerrarModal();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al finalizar el pedido';
            setMensaje(errorMessage);
            setTipoMensaje(false);
            console.error(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Carrito de Compras</h1>
            <button onClick={() => navigate('/catalogo')} className="text-teal-600">
                <FaArrowLeft size={30} />
            </button>
            <div>
                {mensaje && <Mensaje tipo={tipoMensaje}>{mensaje}</Mensaje>}
                {cartItems.length > 0 ? (
                    <div>
                        <div style={styles.tableHeader}>
                            <span style={styles.columnHeader}>Producto</span>
                            <span style={styles.columnHeader}>Imagen</span>
                            <span style={styles.columnHeader}>Cantidad</span>
                            <span style={styles.columnHeader}>Precio</span>
                            <span style={styles.columnHeader}></span>
                        </div>
                        <ul style={styles.list}>
                            {cartItems.map((producto, index) => (
                                <li key={index} style={styles.item}>
                                    <span style={styles.column}>{producto.Producto}</span>
                                    <span style={styles.column}><img src={producto.imagen} alt="Imagen del Producto" className="w-20 h-20 object-cover"/></span>
                                    <span style={styles.column}>{producto.Cantidad}</span>
                                    <span style={styles.column}>{producto.Precio}</span>
                                    <div style={styles.buttons}>
                                        <button
                                            style={{ ...styles.button, ...styles.deleteButton }}
                                            onClick={() => borrarProductoPedido(producto)}>
                                            Borrar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            style={{ ...styles.button, ...styles.payButton }}
                            onClick={finalizarPedido}>
                            Finalizar Compra
                        </button>
                    </div>
                ) : (
                    <p style={styles.noItems}>No hay productos en el carrito.</p>
                )}
            </div>

            {modalIsOpen && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={cerrarModal}
                    contentLabel="Seleccionar Entrega"
                    style={modalStyles}
                >
                    <div className="modal-header">Finalizar Pedido</div>
                    <div className="modal-body">
                        <p>Seleccione la opción de entrega:</p>
                        <div className="modal-radio-group">
                            <label className="modal-radio-label">
                                <input
                                    type="radio"
                                    name="entrega"
                                    value="local"
                                    checked={entrega === 'local'}
                                    onChange={() => setEntrega('local')}
                                />
                                Retirar en el local
                            </label>
                            <label className="modal-radio-label">
                                <input
                                    type="radio"
                                    name="entrega"
                                    value="casa"
                                    checked={entrega === 'casa'}
                                    onChange={() => setEntrega('casa')}
                                />
                                Entregar en casa
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={procesarPedido} className="modal-confirm-button">Confirmar</button>
                        <button onClick={cerrarModal} className="modal-cancel-button">Cancelar</button>
                    </div>
                </Modal>
            )}

            {mostrarFactura && factura && (
                <div className="factura">
                    <h1>Gracias por realizar la compra en el minimarket "Mika y Vale"</h1>
                    <p>Fecha del pedido: {factura.fecha}</p>
                    <p>Nombre del cliente: {factura.nombreCliente}</p>
                    <p>Dirección: {factura.direccion}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factura.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Producto}</td>
                                    <td>{item.Cantidad}</td>
                                    <td>${item.Precio.toFixed(2)}</td>
                                    <td>${(item.Precio * item.Cantidad).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3">Subtotal</td>
                                <td>${factura.total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
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
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    column: {
        flex: 1,
        textAlign: 'center',
    },
    buttons: {
        display: 'flex',
        gap: '10px',
    },
    button: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: 'white',
    },
    payButton: {
        backgroundColor: '#4caf50',
        color: 'white',
        marginTop: '20px',
        width: '100%',
        padding: '10px',
        fontSize: '18px',
    },
    noItems: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
    factura: {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#fff',
    },
    facturaTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    facturaTableTh: {
        borderBottom: '2px solid #ddd',
        padding: '10px',
        textAlign: 'left',
    },
    facturaTableTd: {
        borderBottom: '1px solid #ddd',
        padding: '10px',
        textAlign: 'left',
    },
};

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

export default CarritoDeCompras;