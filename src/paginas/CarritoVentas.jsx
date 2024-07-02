import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useWindowWidth } from '../hooks/useWindowWidth'

const CarritoDeVentas = () => {
    const [cartItems, setCartItems] = useState([]);
    const [ventasId, setVentasId] = useState(null);
    const windowWidth = useWindowWidth();
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [mostrarFactura, setMostrarFactura] = useState(false);
    const [factura, setFactura] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (userId) {
            listarProductosVentas();
        }
    }, [userId]);

    const listarProductosVentas = async () => {
        try {
            const response = await axios.get(`${baseUrl}/ventas/listar?cliente=${userId}`);
            if (response && response.data) {
                const ventas = response.data.Venta;
                const ventasId = Object.keys(ventas)[0];
                const productos = ventas[ventasId];
                setVentasId(ventasId);
                setCartItems(productos.filter(item => item.Producto));
            } else {
                showMessage('No se pudo obtener la información de ventas.', false);
            }
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error al listar los productos de la venta', false);
        }
    };

    const borrarProductoVentas = async (producto) => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${baseUrl}/ventas/borrar/${producto.idProducto}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { cliente: userId },
            });
            showMessage(response.data.message, true);
            listarProductosVentas();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error al borrar el producto de la venta', false);
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const borrarTodoVenta = async () => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${baseUrl}/ventas/eliminar`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { cliente: userId },
            });
            showMessage(response.data.message, true);
            listarProductosVentas();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error al borrar la venta', false);
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

    const procesarVenta = async () => {
        try {
            const response = await axios.post(`${baseUrl}/ventas/registro`, {
                cliente: userId
            });

            showMessage(response.data.message, true);

            if (response.data.Venta) {
                const ventaId = Object.keys(response.data.Venta)[0];
                const ventaData = response.data.Venta[ventaId];
                const productos = ventaData[0].Producto.map((producto, index) => ({
                    Producto: producto,
                    Cantidad: ventaData[0].Cantidad[index],
                    Precio: ventaData[0].Precio[index]
                }));
                const total = ventaData[1].Total;
                const factura = {
                    fecha: new Date(ventaData[1].Fecha).toLocaleDateString(),
                    items: productos,
                    total: total,
                };

                setFactura(factura);
                setMostrarFactura(true);
            } else {
                showMessage('No se pudo obtener la información del pedido.', false);
            }

            cerrarModal();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al finalizar la venta';
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

    return windowWidth > 768 ? (
        <div style={styles.container}>
            <h1 style={styles.header}>Carrito de Ventas</h1>
            <div style={styles.topButtons}>
                <button onClick={() => navigate(-1)} className="text-teal-600">
                    <FaArrowLeft size={30} />
                </button>
                <button onClick={borrarTodoVenta} style={{ ...styles.button, ...styles.deleteButton }}>
                    <FaTrash size={20} /> Eliminar Venta
                </button>
            </div>
            <div>
                {mensaje && (
                    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded ${tipoMensaje ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {mensaje}
                    </div>
                )}
                {cartItems.length > 0 && !mostrarFactura ? (
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
                                    <span style={styles.column}>{producto.Precio}</span>
                                    <div style={styles.buttons}>
                                        <button
                                            style={{ ...styles.button, ...styles.deleteButton }}
                                            onClick={() => borrarProductoVentas(producto)}>
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
                            Finalizar Venta
                        </button>
                    </div>
                ) : (
                    <p style={styles.noItems}>No hay productos en el carrito.</p>
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
                                    <td style={styles.facturaTableTd}>${factura.total.toFixed(2)}</td>
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

            {modalIsOpen && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={cerrarModal}
                    contentLabel="Finalizar Pedido"
                    style={modalStyles}
                >
                    <div className="modal-header" style={styles.modalHeader}><strong>Finalizar Pedido</strong></div>
                    <div className="modal-footer" style={styles.modalFooter}>
                        <button onClick={procesarVenta} style={styles.confirmButton}>Confirmar</button>
                        <button onClick={cerrarModal} style={styles.cancelButton}>Cancelar</button>
                    </div>
                </Modal>
            )}
        </div>
    ): (
        <>
            <div style={{ alignContent: 'center', margin: '0 100px 5% 100px', background: 'red', border: '40px solid red' }}>
                <h1 className='text-5xl py-2 text-white font-medium md:text-6xl text-center'>Lo sentimos, la página no esta disponible para móviles</h1>
                <img src="https://thumbs.dreamstime.com/b/no-utilizar-el-tel%C3%A9fono-m%C3%B3vil-muestra-s%C3%ADmbolo-ejemplo-113030705.jpg " alt="movil" className="center" />
            </div>
        </>
    )
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

export default CarritoDeVentas;