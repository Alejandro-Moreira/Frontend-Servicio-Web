import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCardText,
  MDBCardTitle,
  MDBBadge,
} from "mdb-react-ui-kit";
import { Carousel } from "react-responsive-carousel";
import Mensaje from '../componets/Alertas/Mensaje';

export function Categoria() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inputTouched, setInputTouched] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }
  }, [categoryParam]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categoria/listar");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilter = (event) => {
    const selectedCategory = event.target.value;
    setCategoryFilter(selectedCategory);
    updateURLParams(selectedCategory);
  };

  const updateURLParams = (selectedCategory) => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) {
      queryParams.set("category", selectedCategory);
    }
    const path = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState(null, "", path);
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "" ||
      product.id_categoria === parseInt(categoryFilter);

    return matchSearch && matchCategory;
  });

  const addToCart = async (product) => {
    setError(null);
    setAddingToCart(true);
    setIsLoading(true);

    if (!inputTouched || product.cantidad === "" || product.cantidad === null || parseInt(product.cantidad) <= 0) {
      setError("Por favor, seleccione una cantidad válida.");
      setIsLoading(false);
      return;
    }

    if (parseInt(product.cantidad) > product.stock_number) {
      setError("La cantidad seleccionada supera el stock disponible.");
      setIsLoading(false);
      return;
    }

    const tokenCookie = Cookies.get("token");

    if (!tokenCookie) {
      navigate("/register");
      setIsLoading(false);
      return;
    }

    const cartCookie = Cookies.get("Carrito");
    if (!cartCookie) {
      Cookies.set("Carrito", "Carrito creado");

      try {
        const idUser = Cookies.get("id_user");
        if (!idUser) {
          console.log("No se encontró el id_user en la cookie");
          return;
        }

        const response = await axios.post("/cart/create", { id_user: parseInt(idUser) });
        Cookies.set("infocart", JSON.stringify(response.data));
        const cartId = response.data["cart id"];

        const addProductResponse = await axios.post("/cart/add", {
          id_cart: cartId,
          id_producto: product.id,
          cantidad: parseInt(product.cantidad),
        });

        console.log("Producto añadido al carrito:", addProductResponse.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    } else {
      const infocartCookie = Cookies.get("infocart");
      let cartId;

      try {
        const infocartData = JSON.parse(infocartCookie);
        cartId = infocartData["cart id"];

        const addProductResponse = await axios.post("/cart/add", {
          id_cart: cartId,
          id_producto: product.id,
          cantidad: parseInt(product.cantidad),
        });

        console.log("Producto añadido al carrito:", addProductResponse.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }

    document.dispatchEvent(new Event("addToCart"));
  };

  return (
    <MDBContainer fluid className="Products text-center" style={{ marginTop: "145px" }}>
      {isLoading ? (
        <div className="text-center" style={{ paddingTop: "150px" }}>
          Cargando...
        </div>
      ) : (
        <>
          <h1 className="title" style={{ paddingBottom: "50px" }}>
            Catálogo
          </h1>

          <MDBRow>
            <MDBCol md="6" className="mb-4">
              <MDBInput type="text" label="Buscar" value={searchTerm} onChange={handleSearch} />
            </MDBCol>

            <MDBCol md="6" className="mb-4">
              <select className="form-select" aria-label="Category" value={categoryFilter} onChange={handleCategoryFilter}>
                <option value="">Todas las Categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.nombre}</option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>

          <MDBRow>
            {filteredProducts.map((product) => (
              <MDBCol md="12" lg="4" className="mb-4" key={product.id}>
                <MDBCard>
                  <div
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      marginBottom: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <Carousel showArrows={true} infiniteLoop={true} showStatus={false}>
                      {product.images.map((image) => (
                        <div key={image.id}>
                          <img src={image.cloudinary_url} alt={`Imagen ${image.id}`} style={{ maxWidth: "200px", objectFit: "cover" }} />
                        </div>
                      ))}
                    </Carousel>
                  </div>
                  <MDBCardBody>
                    <MDBCardTitle>
                      <Link to={`/product/${product.id}`} className="text-reset text-decoration-none">
                        {product.nombre_producto}
                      </Link>
                    </MDBCardTitle>
                    <MDBCardText>{product.detalle}</MDBCardText>
                    <h6 className="mb-3">${product.valor_venta}</h6>
                    <h6 className="mb-3">
                      Stock disponible:{" "}
                      <MDBBadge bg={product.stock_number > 0 ? "success" : "danger"}>
                        {product.stock_number}
                      </MDBBadge>
                    </h6>

                    <div className="d-flex flex-column">
                      <div className="mb-3">
                        <MDBInput
                          type="number"
                          min="1"
                          label="Cantidad"
                          max={product.stock_number}
                          onChange={(e) => {
                            if (!e.target.value.includes("+") && !e.target.value.includes("-")) {
                              product.cantidad = e.target.value;
                            }
                          }}
                          onFocus={() => setInputTouched(true)}
                          onKeyDown={(e) => {
                            if (e.key === "+" || e.key === "-") {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>

                      <MDBBtn color="success" onClick={() => addToCart(product)}>
                        Añadir al carrito <MDBIcon icon="cart-plus" className="ms-2" />
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>

          {error && (
            <Mensaje
              title="Error al agregar al carrito"
              message={error}
              onClose={() => setError(null)}
            />
          )}
        </>
      )}
    </MDBContainer>
  );
}

export default Categoria;
