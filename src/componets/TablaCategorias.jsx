import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteModal from "../Modals/DeleteModal";
import Search from "../Search";
import AddRecordButton from "../AddRecordButton";

const TablaCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [originalCategorias, setOriginalCategorias] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriasPerPage] = useState(6);

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categoria/listar`);
                setCategorias(response.data);
                setOriginalCategorias(response.data); // Almacenar las categorías originales
            } catch (error) {
                console.log("Error al obtener categorías", error);
            }
        };
        obtenerCategorias();
    }, []);

    const eliminarCategoria = async (categoriaId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categoria/borrar/${categoriaId}`);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categoria/listar`);
            setCategorias(response.data);
            setOriginalCategorias(response.data); // Actualizar las categorías originales después de eliminar una categoría
        } catch (error) {
            console.log(error);
        }
    }

    const buscador = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);
        if (searchTerm === "") {
            setCategorias(originalCategorias); // Restaurar las categorías originales cuando el término de búsqueda está vacío
        } else {
            const filteredCategorias = originalCategorias.filter((categoria) => {
                return categoria.categoria.toLowerCase().includes(searchTerm);
            });
            setCategorias(filteredCategorias);
        }
    }

    // Paginación
    const indexOfLastCategoria = currentPage * categoriasPerPage;
    const indexOfFirstCategoria = indexOfLastCategoria - categoriasPerPage;
    const currentCategorias = categorias.slice(indexOfFirstCategoria, indexOfLastCategoria);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className="flex-grow">
                    <Search searchValue={search} onSearch={buscador} />
                </div>
                <AddRecordButton text="categorías" to="/dashboard/categorias/agregar-categoria" />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre de la categoría</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentCategorias && currentCategorias.length > 0 ? (
                        currentCategorias.map((categoria) => (
                            <tr key={categoria._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{categoria.categoria}</td>
                                <td className="flex items-center px-6 py-4">
                                    <Link to={`/dashboard/categorias/actualizar-categoria/${categoria._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Editar
                                    </Link>
                                    <DeleteModal
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        text={"categoría"}
                                        deleteFunction={() => eliminarCategoria(categoria._id)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No existen registros de categorías</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {/* Paginación */}
            <div className="mt-3 flex justify-center">
                {categorias.length > categoriasPerPage && (
                    <ul className="flex list-none">
                        {Array.from({ length: Math.ceil(categorias.length / categoriasPerPage) }).map((_, index) => (
                            <li key={index} className="px-2">
                                <button
                                    className={`bg-gray-200 rounded-md w-6 text-gray-500 hover:underline focus:outline-none ${currentPage === index + 1 ? 'font-semibold text-blue-500' : ''}`}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

export default TablaCategorias;