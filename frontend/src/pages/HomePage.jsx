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
import OtpInput from "../components/OtpInput.jsx";
const pageSize = 10;

const HomePage = () => {
  const [productList, setProductList] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [originalBrandList, setOriginalBrandList] = useState([]);
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
  const [pagination, setPagination] = useState({
    count: 100,
    from: 0,
    to: pageSize,
  });

  const handlePagination = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
  };

  useEffect(() => {
    setPagination({ ...pagination, count: productList.length });
  }, [pagination.from, pagination.to, productList, pagination.count]);

  useEffect(() => {
    setLoading(true);
    getProduct();
  }, []);

  useEffect(() => {}, [priceRange, allbrandList, minPrice, maxPrice]);

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

  const handleClearFilters = () => {
    setSearchValue("");
    setCategory("all");
    setSortValue("Select value");
    setMinPriceDinamic(minPrice);
    setMaxPriceDinamic(maxPrice);
    setPriceRange([minPrice, maxPrice]);

    setAllBrandList(
      originalBrandList.map((item) => ({ ...item, checked: false }))
    );
    setProductList(originalData);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setProductList(
      value === ""
        ? originalData
        : originalData.filter((item) =>
            item.title.toLowerCase().includes(value.toLowerCase())
          )
    );
  };

  const handleSort = (value) => {
    let sortedData = [...productList];
    setSortValue(value);
    if (value === "ascendingprice")
      sortedData.sort((a, b) => a.price - b.price);
    else if (value === "descendingprice")
      sortedData.sort((a, b) => b.price - a.price);
    else if (value === "ascendingrating")
      sortedData.sort((a, b) => a.rating - b.rating);
    else if (value === "descendingrating")
      sortedData.sort((a, b) => b.rating - a.rating);
    else if (value === "ascpricediscount")
      sortedData.sort((a, b) => a.discountPercentage - b.discountPercentage);
    else if (value === "descpricediscount")
      sortedData.sort((a, b) => b.discountPercentage - a.discountPercentage);
    else sortedData = originalData;
    setProductList(sortedData);
  };

  const handleCatChange = (value) => {
    setCategory(value);
    setProductList(
      value === "all"
        ? originalData
        : originalData.filter((item) => item.category === value)
    );
  };

  const handlePriceRange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPriceDinamic(newValue[0]);
    setMaxPriceDinamic(newValue[1]);
    setProductList(
      originalData.filter(
        (item) => item.price >= newValue[0] && item.price <= newValue[1]
      )
    );
  };

  const handleMinPrice = (event) => {
    setMinPriceDinamic(parseInt(event.target.value));
    handlePriceRange(null, [parseInt(event.target.value), maxPriceDinamic]);
  };

  const handleMaxPrice = (event) => {
    setMaxPriceDinamic(parseInt(event.target.value));
    handlePriceRange(null, [minPriceDinamic, parseInt(event.target.value)]);
  };

  const handleChanges = (index) => {
    const updatedBrands = [...allbrandList];
    updatedBrands[index].checked = !updatedBrands[index].checked;
    setAllBrandList(updatedBrands);

    const selectedBrands = updatedBrands
      .filter((brand) => brand.checked)
      .map((b) => b.value);
    if (selectedBrands.length === 0) {
      setProductList(originalData);
    } else {
      setProductList(
        originalData.filter((product) => selectedBrands.includes(product.brand))
      );
    }
  };

  return (
    <div className="homepage-container">
    <OtpInput/>

      <NavBar />
      <div className="filters">
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
        <>
          <div className="products">
            {productList.length !== 0 ? (
              productList
                .slice(pagination.from, pagination.to)
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    getProduct={getProduct}
                  />
                ))
            ) : (
              <div className="no-products">
                <img src={not_found_pic} alt="Not Found" />
              </div>
            )}
          </div>
          <div className="pagination">
            <Pagination
              count={Math.ceil(pagination.count / pageSize)}
              onChange={(e, value) => handlePagination(e, value)}
              sx={{
                "& .MuiPaginationItem-root": { color: "white" }, // Text color
                "& .Mui-selected": {
                  backgroundColor: "#493d9e",
                  color: "white",
                }, // Selected page color
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "#66BB6A",
                  color: "white",
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
