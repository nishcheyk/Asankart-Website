import React, { useEffect, useState } from "react";
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

const pageSize = 10;

const HomePage = () => {
  const [productList, setProductList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get("http://localhost:5000/product/meta");
        setAllBrandList(res.data.brands.map(b => ({ value: b, checked: false })));
        setMinPrice(res.data.minPrice);
        setMaxPrice(res.data.maxPrice);
        setMinPriceDinamic(res.data.minPrice);
        setMaxPriceDinamic(res.data.maxPrice);
        setPriceRange([res.data.minPrice, res.data.maxPrice]);
      } catch (e) { console.log(e); }
    };
    fetchMeta();
  }, []);

  const [originalData, setOriginalData] = useState([]);
  const [originalBrandList, setOriginalBrandList] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get("http://localhost:5000/product");
      setProductList(response.data);
      setOriginalData(response.data);

      let min = Math.min(...response.data.map((val) => val.price));
      let max = Math.max(...response.data.map((val) => val.price));
      setMinPrice(min);
      setMaxPrice(max);
      setMinPriceDinamic(min);
      setMaxPriceDinamic(max);
      setPriceRange([min, max]);

      let brand_array = response.data.map((item) => item.brand);
      let uniqbrandlist = [...new Set(brand_array)];
      let uniqChecklist = uniqbrandlist.map((item) => ({
        value: item,
        checked: false,
      }));

      setOriginalBrandList(uniqChecklist);
      setAllBrandList(uniqChecklist);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleCatChange = (value) => {
    setCategory(value);
    applyAllFilters(value, searchValue, sortValue, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    applyAllFilters(category, value, sortValue, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  const handleSort = (value) => {
    setSortValue(value);
    applyAllFilters(category, searchValue, value, minPriceDinamic, maxPriceDinamic, allbrandList);
  };

  const handlePriceRange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPriceDinamic(newValue[0]);
    setMaxPriceDinamic(newValue[1]);
    applyAllFilters(category, searchValue, sortValue, newValue[0], newValue[1], allbrandList);
  };

  const handleMinPrice = (event) => {
    const newMinPrice = parseInt(event.target.value);
    setMinPriceDinamic(newMinPrice);
    applyAllFilters(category, searchValue, sortValue, newMinPrice, maxPriceDinamic, allbrandList);
  };

  const handleMaxPrice = (event) => {
    const newMaxPrice = parseInt(event.target.value);
    setMaxPriceDinamic(newMaxPrice);
    applyAllFilters(category, searchValue, sortValue, minPriceDinamic, newMaxPrice, allbrandList);
  };

  const handleChanges = (index) => {
    const updatedBrands = [...allbrandList];
    updatedBrands[index].checked = !updatedBrands[index].checked;
    setAllBrandList(updatedBrands);
    applyAllFilters(category, searchValue, sortValue, minPriceDinamic, maxPriceDinamic, updatedBrands);
  };

  const applyAllFilters = (cat, search, sort, minPrice, maxPrice, brands) => {
    let filteredData = [...originalData];

    // Apply category filter
    if (cat && cat !== "all") {
      filteredData = filteredData.filter((item) => item.category === cat);
    }

    // Apply search filter
    if (search && search !== "") {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply price range filter
    filteredData = filteredData.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );

    // Apply brand filter
    const selectedBrands = brands
      .filter((brand) => brand.checked)
      .map((b) => b.value);
    if (selectedBrands.length > 0) {
      filteredData = filteredData.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Apply sorting
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

    setProductList(filteredData);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setCategory("all");
    setSortValue("Select value");
    setMinPriceDinamic(minPrice);
    setMaxPriceDinamic(maxPrice);
    setPriceRange([minPrice, maxPrice]);
    setAllBrandList(originalBrandList.map((item) => ({ ...item, checked: false })));
    setProductList(originalData);
  };

  const handlePagination = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
  };

  useEffect(() => {
    setPagination({ ...pagination, count: productList.length });
  }, [pagination.from, pagination.to, productList, pagination.count]);

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
    {productList.length !== 0 ? (
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
        productList
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
        count={Math.ceil(pagination.count / pageSize)}
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
