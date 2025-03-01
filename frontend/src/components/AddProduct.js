import React, { useState } from "react";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AddProduct.css"; // Import CSS

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    title: "",
    brand: "",
    category: "",
    description: "",
    discountPercentage: "",
    images: [""],
    price: "",
    rating: "",
    stock: "",
    thumbnail: "",
  });

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log(productData);
    try {
      const response = await axios.post(
        "http://localhost:5000/product/create",
        { data: productData }
      );
      if (response.data === "Product saved to the database!") {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="add-product-container">
      <Paper elevation={3} className="add-product-paper">
        <Typography variant="h5" className="add-product-title">
          Add Product
        </Typography>

        <Grid container spacing={3} className="add-product-grid">
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="outlined"
              className="add-product-textfield"
              value={productData.title}
              name="title"
              onChange={handleInputChanges}
            />
            <TextField
              label="Brand"
              variant="outlined"
              className="add-product-textfield"
              value={productData.brand}
              name="brand"
              onChange={handleInputChanges}
            />
            <TextField
              label="Category"
              variant="outlined"
              className="add-product-textfield"
              value={productData.category}
              name="category"
              onChange={handleInputChanges}
            />
            <TextField
              label="Description"
              variant="outlined"
              className="add-product-textfield"
              value={productData.description}
              name="description"
              onChange={handleInputChanges}
            />
            <TextField
              label="Discount Percentage"
              variant="outlined"
              className="add-product-textfield"
              type="number"
              value={productData.discountPercentage}
              name="discountPercentage"
              onChange={handleInputChanges}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <div className="add-product-image-section">
              {productData.images.map((img, index) => (
                <TextField
                  key={index}
                  label={`Image ${index + 1}`}
                  variant="outlined"
                  className="add-product-textfield"
                  value={img}
                  onChange={(e) => {
                    const newImages = [...productData.images];
                    newImages[index] = e.target.value;
                    setProductData({ ...productData, images: newImages });
                  }}
                />
              ))}
              <Button
                className="add-product-btn"
                onClick={() =>
                  setProductData({
                    ...productData,
                    images: [...productData.images, ""],
                  })
                }
              >
                Add Another Image
              </Button>
            </div>

            <TextField
              label="Price"
              variant="outlined"
              className="add-product-textfield"
              type="number"
              value={productData.price}
              name="price"
              onChange={handleInputChanges}
            />
            <TextField
              label="Rating"
              variant="outlined"
              className="add-product-textfield"
              type="number"
              value={productData.rating}
              name="rating"
              onChange={handleInputChanges}
            />
            <TextField
              label="Stock"
              variant="outlined"
              className="add-product-textfield"
              type="number"
              value={productData.stock}
              name="stock"
              onChange={handleInputChanges}
            />
            <TextField
              label="Thumbnail"
              variant="outlined"
              className="add-product-textfield"
              value={productData.thumbnail}
              name="thumbnail"
              onChange={handleInputChanges}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          className="add-product-save-btn"
          onClick={handleSave}
        >
          Save Product
        </Button>
      </Paper>
    </div>
  );
};

export default AddProduct;
