import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

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
            showMessage(error.response?.data?.message || 'Error al listar los productos del pedido', false);
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
            showMessage(response.data.message, true);
            listarProductosPedido();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error al borrar el producto del pedido', false);
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const borrarTodoPedido = async () => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${baseUrl}/pedidos/eliminar`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { cliente: userId },
            });
            showMessage(response.data.message, true);
            listarProductosPedido();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error al borrar el pedido', false);
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

            showMessage(response.data.message, true);

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
                showMessage(response.data.message, false);
            }

            cerrarModal();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al finalizar el pedido';
            showMessage(errorMessage, false);
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const showMessage = (message, isSuccess) => {
        setMensaje(message);
        setTipoMensaje(isSuccess);
        setTimeout(() => {
            setMensaje('');
        }, 3000);
    };

    const calcularTotal = () => {
        return cartItems.reduce((total, item) => total + item.Precio * item.Cantidad, 0).toFixed(2);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Carrito de Compras</h1>
            <div style={styles.topButtons}>
                <button onClick={() => navigate(-1)} className="text-teal-600">
                    <FaArrowLeft size={30} />
                </button>
                <button onClick={borrarTodoPedido} style={{ ...styles.button, ...styles.deleteButton }}>
                    <FaTrash size={20} /> Eliminar Pedido
                </button>
            </div>
            <div>
                {mensaje && (
                    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded ${tipoMensaje ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {mensaje}
                    </div>
                )}
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
                        <div style={styles.total}>
                            <strong>Total: ${calcularTotal()}</strong>
                        </div>
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
                    <div className="modal-header" style={styles.modalHeader}><strong>Finalizar Pedido</strong></div>
                    <div className="modal-body" style={styles.modalBody}>
                        <p>Seleccione la opción de entrega:</p>
                        <div className="modal-radio-group" style={styles.radioGroup}>
                            <label className="modal-radio-label" style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="entrega"
                                    value="local"
                                    checked={entrega === 'local'}
                                    onChange={() => setEntrega('local')}
                                />
                                <span>Retirar en el local</span>
                            </label>
                            <label className="modal-radio-label" style={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="entrega"
                                    value="casa"
                                    checked={entrega === 'casa'}
                                    onChange={() => setEntrega('casa')}
                                />
                                <span>Entregar en casa</span>
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer" style={styles.modalFooter}>
                        <button onClick={procesarPedido} className="modal-confirm-button" style={styles.confirmButton}>Confirmar</button>
                        <button onClick={cerrarModal} className="modal-cancel-button" style={styles.cancelButton}>Cancelar</button>
                    </div>
                </Modal>
            )}

            {mostrarFactura && factura && (
                <div className="factura" style={styles.factura}>
                    <h1>Gracias por realizar la compra en el minimarket "Mika y Vale"</h1>
                    <p>Fecha del pedido: {factura.fecha}</p>
                    <p>Nombre del cliente: {factura.nombreCliente}</p>
                    <p>Dirección: {factura.direccion}</p>
                    <table style={styles.facturaTable}>
                        <thead>
                            <tr>
                                <th style={styles.facturaTableTh}>Producto</th>
                                <th style={styles.facturaTableTh}>Cantidad</th>
                                <th style={styles.facturaTableTh}>Precio</th>
                                <th style={styles.facturaTableTh}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factura.items.map((item, index) => (
                                <tr key={index}>
                                    <td style={styles.facturaTableTd}>{item.Producto}</td>
                                    <td style={styles.facturaTableTd}>{item.Cantidad}</td>
                                    <td style={styles.facturaTableTd}>${item.Precio.toFixed(2)}</td>
                                    <td style={styles.facturaTableTd}>${(item.Precio * item.Cantidad).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={styles.facturaTableTd}>Subtotal</td>
                                <td style={styles.facturaTableTd}>${factura.total.toFixed(2)}</td>
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
    topButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
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
    total: {
        textAlign: 'right',
        marginTop: '10px',
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
    confirmButton: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    modalHeader: {
        fontWeight: 'bold',
    },
    modalBody: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    }
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