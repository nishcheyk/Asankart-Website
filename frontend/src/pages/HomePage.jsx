import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import not_found_pic from "../img/not_found.png";
import Pagination from "@mui/material/Pagination";
import "../css/HomePage.css";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import SearchComponent from "../filterComponents/SearchComponent";
import SortComponent from "../filterComponents/SortComponent";
import CategoryComponent from "../filterComponents/CategoryComponent";
import PriceRangeComponent from "../filterComponents/PriceRangeComponent";
import BrandListComponent from "../filterComponents/BrandListComponent";
import Loader from "../components/Loader";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const pageSize = 10;

// HomePage component - main landing page jo products display karta hai
const HomePage = () => {
  // State variables - different data store karne ke liye
  const [productList, setProductList] = useState([]); // All products ka array
  const [searchValue, setSearchValue] = useState(""); // Search input
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPriceDinamic, setMinPriceDinamic] = useState(0);
  const [maxPriceDinamic, setMaxPriceDinamic] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [category, setCategory] = useState("all");
  const [sortValue, setSortValue] = useState("Select value");
  const [allbrandList, setAllBrandList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });
  const [token, setToken] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [error, setError] = useState(null); // Error state
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [selectedBrand, setSelectedBrand] = useState(""); // Selected brand
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 }); // Price filter
  const [sortBy, setSortBy] = useState(""); // Sort option

  // Context se user data fetch karta hai
  const { token, isAdmin } = useContext(AuthContext);
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // Navigation ke liye

  // Component mount hone par products fetch karta hai
  useEffect(() => {
    fetchProducts();
  }, []);

  // Products fetch karne ka function - backend se data get karta hai
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/product/");
      setProductList(response.data);
      setFilteredProducts(response.data);
      setMinPrice(response.data.minPrice);
      setMaxPrice(response.data.maxPrice);
      setMinPriceDinamic(response.data.minPrice);
      setMaxPriceDinamic(response.data.maxPrice);
      setPriceRange([response.data.minPrice, response.data.maxPrice]);

      let brand_array = response.data.map((item) => item.brand);
      let uniqbrandlist = [...new Set(brand_array)];
      let uniqChecklist = uniqbrandlist.map((item) => ({
        value: item,
        checked: false,
      }));

      setAllBrandList(uniqChecklist);
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality - products ko search term ke hisab se filter karta hai
  const handleSearch = (value) => {
    setSearchValue(value);
    applyAllFilters(category, value, sortValue, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  // Category filter - products ko category ke hisab se filter karta hai
  const handleCatChange = (value) => {
    setCategory(value);
    applyAllFilters(value, searchValue, sortValue, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  // Brand filter - products ko brand ke hisab se filter karta hai
  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
    applyAllFilters(category, searchValue, sortValue, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  // Price range filter - products ko price range ke hisab se filter karta hai
  const handlePriceFilter = (range) => {
    setPriceRange(range);
    setMinPriceDinamic(range.min);
    setMaxPriceDinamic(range.max);
    applyAllFilters(category, searchValue, sortValue, range.min, range.max, allbrandList);
  };

  // Sort functionality - products ko different criteria ke hisab se sort karta hai
  const handleSort = (value) => {
    setSortValue(value);
    applyAllFilters(category, searchValue, value, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  // All filters apply karne ka function - search, category, brand, price, sort
  const applyAllFilters = (cat, search, sort, minPrice, maxPrice, brands) => {
    let filteredData = [...productList];

    // Search filter - product name mein search term check karta hai
    if (search && search !== "") {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter - product category check karta hai
    if (cat && cat !== "all") {
      filteredData = filteredData.filter((item) => item.category === cat);
    }

    // Brand filter - product brand check karta hai
    const selectedBrands = brands
      .filter((brand) => brand.checked)
      .map((b) => b.value);
    if (selectedBrands.length > 0) {
      filteredData = filteredData.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price filter - product price range check karta hai
    filteredData = filteredData.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );

    // Sort functionality - different sorting options
    if (sort && sort !== "Select value") {
      if (sort === "ascendingprice")
        filteredData.sort((a, b) => a.price - b.price);
      else if (sort === "descendingprice")
        filteredData.sort((a, b) => b.price - a.price);
      else if (sort === "ascendingrating")
        filteredData.sort((a, b) => a.rating - b.rating);
      else if (sort === "descendingrating")
        filteredData.sort((a, b) => b.rating - a.rating);
      else if (sort === "ascpricediscount")
        filteredData.sort((a, b) => a.discountPercentage - b.discountPercentage);
      else if (sort === "descpricediscount")
        filteredData.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    setFilteredProducts(filteredData);
  };

  // Add to cart function - product ko cart mein add karta hai
  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, amount: 1 })); // Redux action dispatch karta hai
  };

  // Product details page par navigate karne ka function
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Loading state - spinner show karta hai
  if (loading) {
    return <Loader />;
  }

  // Error state - error message show karta hai
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="homepage-container">
      <NavBar />
      <button
        className="filter-toggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      <div className="main-content">
      <div className={`filters ${showFilters ? "expanded" : "collapsed"}`}>
        <button className="clear-button" onClick={handleClearFilters}>
          Clear filters
        </button>
        <SearchComponent onChange={handleSearch} searchValue={searchValue} />
        <SortComponent onChange={handleSort} sortValue={sortValue} />
        <CategoryComponent
          onChange={handleCatChange}
          categoryValue={category}
        />
        <PriceRangeComponent
          minPriceDinamic={minPriceDinamic}
          maxPriceDinamic={maxPriceDinamic}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          handleMaxPrice={handleMaxPrice}
          handleMinPrice={handleMinPrice}
          handlePriceRange={handlePriceRange}
        />
        <BrandListComponent
          allbrandList={allbrandList}
          onChange={handleChanges}
        />
      </div>
      {loading ? (
  <Loader />
) : (
  <div className="products">
    {filteredProducts.length !== 0 ? (
      isAdmin === "true" ? (
        <DragDropContext
          onDragEnd={async (result) => {
            if (!result.destination) return;
            const items = Array.from(productList);
            const [movedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, movedItem);
            setProductList(items);
            try {
              await axios.post("http://localhost:5000/product/reorder", {
                productIds: items.map((item) => item._id),
              });
              getProduct();
            } catch (err) {
              console.error("Reorder failed:", err);
            }
          }}
        >
          <Droppable droppableId="adminProductList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {productList
                  .slice(pagination.from, pagination.to)
                  .map((product, index) => (
                    <Draggable
                      key={product._id}
                      draggableId={product._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ProductCard
                            key={product._id}
                            product={product}
                            getProduct={getProduct}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        filteredProducts
          .slice(pagination.from, pagination.to)
          .map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              getProduct={getProduct}
            />
          ))
      )
    ) : (
      <div className="no-products">
        <img src="/not-found.png" alt="Not Found" />
      </div>
    )}
    <div className="pagination">
      <Pagination
        count={Math.ceil(filteredProducts.length / pageSize)}
        onChange={(e, value) => handlePagination(e, value)}
        sx={{
          "& .MuiPaginationItem-root": { color: "white" },
          "& .Mui-selected": {
            backgroundColor: "#493d9e",
            color: "white",
          },
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "#66BB6A",
            color: "white",
          },
        }}
      />
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default HomePage;
