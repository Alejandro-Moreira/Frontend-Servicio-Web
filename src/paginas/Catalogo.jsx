import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LandinPage = () => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    return (
        <main className='bg-white px-10 md:px-20 lg:px-40 '>
            <section>
                <nav className='p-10 mb-12 flex justify-between'>
                    <h1 className='text-2xl font-bold '>Minimarket "Mika y Vale"</h1>
                    <ul className='flex items-center'>
                        <li>
                            <Link to="/login" className='bg-gray-600 text-slate-400 px-6 py-2 rounded-full ml-8 hover:bg-gray-900 hover:text-white' href="#">Login</Link>
                        </li>
                    </ul>
                </nav>

                <div className='text-center'>
                    <h2 className='text-5xl py-2 text-teal-600 font-medium md:text-6xl'>Productos Disponibles</h2>
                </div>
            </section>

            <section>
                <div className='md:flex md:flex-wrap lg:flex lg:justify-center gap-10'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap:10 justify-center'>

                        {/* Tarjeta de Plátanos */}
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://qph.cf2.quoracdn.net/main-qimg-a9c901f3599d852b326de20df987f602-lq" alt="Plátanos" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Plátanos</h3>
                                    <p className='text-gray-800 py-1'>$ 1.00</p>
                                    <button onClick={() => addToCart('Plátanos')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://www.lafabril.com.ec/wp-content/uploads/2017/10/la-favorita-original.png" alt="Aceite" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Aceite</h3>
                                    <p className='text-gray-800 py-1'>$ 2.50</p>
                                    <button onClick={() => addToCart('Aceite')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9jf1NM3U8s4XksTavDZaaeKxU4oI3Pcik9D1Qgq8ypg&s" alt="Arroz" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Arroz</h3>
                                    <p className='text-gray-800 py-1'>$ 1.25</p>
                                    <button onClick={() => addToCart('Arroz')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://i0.wp.com/almacenescorsa.com/wp-content/uploads/2021/07/Azucar-Valdez-blanco-1kg.jpg?resize=300%2C300&ssl=1" alt="Azucar" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Azúcar</h3>
                                    <p className='text-gray-800 py-1'>$ 1.50</p>
                                    <button onClick={() => addToCart('Azucar')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://tesaliacbc.com/wp-content/uploads/2021/06/Guitig-3000ml-212x300.png" alt="Guitig" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Güitig</h3>
                                    <p className='text-gray-800 py-1'>$ 2.00</p>
                                    <button onClick={() => addToCart('Guitig')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKyM-du3wltIkTukekURwrgwvMz3z8oQyBCEYmVL7VUg&s" alt="Cocacola" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Coca - Cola</h3>
                                    <p className='text-gray-800 py-1'>$ 3.00</p>
                                    <button onClick={() => addToCart('Cocacola')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToKp8XZ5iRnqo7HzccYhdq9KX7ppaIe9BxXxTQ5lJtpw&s" alt="Pepsi" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Pepsi</h3>
                                    <p className='text-gray-800 py-1'>$ 2.00</p>
                                    <button onClick={() => addToCart('Pepsi')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://eyrb4uf8voh.exactdn.com/wp-content/uploads/2021/01/PULP-JUGO-EN-NECTAR-DURAZNO-1L.png?strip=all&lossy=1&ssl=1" alt="Pulp" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Pulp</h3>
                                    <p className='text-gray-800 py-1'>$ 1.25</p>
                                    <button onClick={() => addToCart('Pulp')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVJh8pEehYr_fMTNpXaXsaBEizepkRVuzQdHMIK5Lm_Q&s" alt="Deja" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Deja</h3>
                                    <p className='text-gray-800 py-1'>$ 1.00</p>
                                    <button onClick={() => addToCart('Deja')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNeNTdhUlb3q2wnPagfNCNaN0cG2fwl-S9_9n2l9mlMA&s" alt="Cloro" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Cloro</h3>
                                    <p className='text-gray-800 py-1'>$ 3.00</p>
                                    <button onClick={() => addToCart('Cloro')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://cdn1.totalcommerce.cloud/mercacentro/product-zoom/es/shampoo-savital-hialuronico-x-510-ml-1.webp" alt="Shampoo" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Shampoo</h3>
                                    <p className='text-gray-800 py-1'>$ 3.00</p>
                                    <button onClick={() => addToCart('Shampoo')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://www.kipclin.com/images/virtuemart/product/KIP-PQP-SUAVI000378.jpg" alt="suavizante" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Suavizante</h3>
                                    <p className='text-gray-800 py-1'>$ 5.00</p>
                                    <button onClick={() => addToCart('suavizante')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://www.recetasnestle.com.co/sites/default/files/inline-images/tipos-de-manzana-royal-gala_0.jpg" alt="manzana" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Manzana</h3>
                                    <p className='text-gray-800 py-1'>$ 1.00</p>
                                    <button onClick={() => addToCart('manzana')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://panycanelaec.com/storage/2023/05/160703039_G.jpg" alt="yogurt" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Yogurt</h3>
                                    <p className='text-gray-800 py-1'>$ 2.00</p>
                                    <button onClick={() => addToCart('yogurt')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://www.fybeca.com/on/demandware.static/-/Sites-masterCatalog_FybecaEcuador/default/dwceddc95e/images/large/100091327-LECHE-ENTERA-VITA-1-L-UNIDAD.jpg" alt="Leche" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Leche</h3>
                                    <p className='text-gray-800 py-1'>$ 1.00</p>
                                    <button onClick={() => addToCart('Leche')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className='thumb-block'>
                                <div className='text-center shadow-2xl p-10 rounded-xl my-10 md:w-72 lg:w-96'>
                                    <img className='mx-auto h-40 w-40' src="https://tropicalcheese.com/wp-content/uploads/2019/02/queso-fresco-mexican-wheel-480x480.jpg" alt="Queso" />
                                    <h3 className='text-lg font-medium pt-8 pb-2'>Queso</h3>
                                    <p className='text-gray-800 py-1'>$ 2.00</p>
                                    <button onClick={() => addToCart('Queso')} className="bg-teal-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-800">Comprar</button>
                                </div>
                            </div>
                        </Link>
                        {/* Repite este bloque para cada elemento de tarjeta */}

                    </div>
                </div>
            </section>

        </main>
    );
};
