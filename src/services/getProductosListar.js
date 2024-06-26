import axios from 'axios';

export const getProductosListar = async (producto = "") => await axios
.get(`${import.meta.env.VITE_BACKEND_URL}/productos/listar${producto && `?name=${producto}`}`)