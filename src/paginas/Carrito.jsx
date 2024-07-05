import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useWindowWidth } from '../hooks/useWindowWidth';

Modal.setAppElement('#root'); 

const CarritoDeCompras = () => {
    const [cartItems, setCartItems] = useState([]);
    const [pedidoId, setPedidoId] = useState(null);
    const windowWidth = useWindowWidth();
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
            localStorage.setItem('cartItems', JSON.stringify(productos.filter(item => item.Producto)));
        } catch (error) {
            showMessage(error.response?.data?.message || 'No se esta realizando ningún pedido', false);
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
            const updatedCartItems = cartItems.filter(item => item.idProducto !== producto.idProducto);
            setCartItems(updatedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
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
            setCartItems([]);
            localStorage.removeItem('cartItems');
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

    const confirmarEntrega = () => {
        setModalIsOpen(false);
        procesarPedido();
    };

    const obtenerComision = () => {
        return entrega === 'casa' ? 0.50 : 0;
    };

    const calcularSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.Precio * item.Cantidad, 0).toFixed(2);
    };

    const calcularTotal = () => {
        const subtotal = parseFloat(calcularSubtotal());
        const comision = obtenerComision();
        return (subtotal + comision).toFixed(2);
    };

    const procesarPedido = async () => {
        try {
            const response = await axios.post(`${baseUrl}/pedidos/registro`, {
                cliente: userId,
                comision: entrega === 'casa'
            });

            showMessage(response.data.message, true);

            const pedidoKey = Object.keys(response.data.Pedido)[0];
            const pedidoData = response.data.Pedido[pedidoKey];
            const productos = pedidoData[0];
            const detalles = pedidoData[1];

            const factura = {
                fecha: new Date(detalles.Fecha).toLocaleDateString(),
                items: productos.Producto.map((prod, index) => ({
                    Producto: prod,
                    Cantidad: productos.Cantidad[index],
                    Precio: productos.Precio[index],
                })),
                subtotal: parseFloat(calcularSubtotal()),
                comision: obtenerComision(),
                total: parseFloat(calcularTotal()),
                entrega,
                nombreCliente: userId,
                direccion: entrega === 'casa' ? 'Dirección de entrega' : 'Retiro en local'
            };

            setFactura(factura);
            setMostrarFactura(true);
            localStorage.removeItem('cartItems');
        } catch (error) {
            showMessage(response.data.message);
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const finalizarPedido = () => {
        abrirModal();
    };

    const showMessage = (message, isSuccess) => {
        setMensaje(message);
        setTipoMensaje(isSuccess);
        setTimeout(() => {
            setMensaje('');
        }, 3000);
    };

    return windowWidth > 768 ? (
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
                                    <span style={styles.column}><img src={producto.imagen} alt="Imagen del Producto" className="w-20 h-20 object-cover" /></span>
                                    <span style={styles.column}>{producto.Cantidad}</span>
                                    <span style={styles.column}>${producto.Precio.toFixed(2)}</span>
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
                            <strong>Subtotal: ${calcularSubtotal()}</strong>
                        </div>
                        <div style={styles.total}>
                            <strong>Comisión: ${obtenerComision().toFixed(2)}</strong>
                        </div>
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
                    contentLabel="Confirmar entrega"
                    style={modalStyles}
                >
                    <div className="modal-header" style={styles.modalHeader}><strong>Opciones de Entrega</strong></div>
                    <div className="modal-body" style={styles.modalBody}>
                        <p>Seleccione una opción de entrega:</p>
                        <div style={styles.entregaOptions}>
                            <label>
                                <input
                                    type="radio"
                                    value="local"
                                    checked={entrega === 'local'}
                                    onChange={(e) => setEntrega(e.target.value)}
                                />
                                Retirar en el local
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="casa"
                                    checked={entrega === 'casa'}
                                    onChange={(e) => setEntrega(e.target.value)}
                                />
                                Entregar en casa
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer" style={styles.modalFooter}>
                        <button onClick={confirmarEntrega} className="modal-close-button" style={styles.confirmButton}>Confirmar</button>
                        <button onClick={cerrarModal} className="modal-close-button" style={styles.cancelButton}>Cancelar</button>
                    </div>
                </Modal>
            )}

            {mostrarFactura && factura && (
                <div className="factura" style={styles.factura}>
                    <h1>Gracias por realizar la compra en el minimarket "Mika y Vale"</h1>
                    <p>Fecha del pedido: {factura.fecha}</p>
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
                                <td style={styles.facturaTableTd}>${factura.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={styles.facturaTableTd}>Comisión</td>
                                <td style={styles.facturaTableTd}>${factura.comision.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={styles.facturaTableTd}><strong>Total</strong></td>
                                <td style={styles.facturaTableTd}><strong>${factura.total.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    ) : (
        <div style={{ alignContent: 'center', margin: '0 100px 5% 100px', background: 'red', border: '40px solid red' }}>
            <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no está disponible para móviles</h1>
            <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg" alt="movil" className="center" />
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
    entregaOptions: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        marginBottom: '20px',
    },
    factura: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
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