import React, { useEffect, useState } from 'react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
    }, []);

    return (
        <div>
            <h1>Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>{item.nombre} - $ {item.precio.toFixed(2)}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
