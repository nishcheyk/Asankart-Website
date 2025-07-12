import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Slider } from '@mui/material';

// PriceRangeComponent - price range filter karne ke liye
const PriceRangeComponent = ({ onPriceRangeChange, maxPrice = 10000 }) => {
  // Price range state
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  // Price range change handle karne ka function
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPrice(newValue[0]);
    setMaxPriceInput(newValue[1]);
  };

  // Min price input change handle karne ka function
  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setMinPrice(value);
    setPriceRange([value, priceRange[1]]);
  };

  // Max price input change handle karne ka function
  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value) || maxPrice;
    setMaxPriceInput(value);
    setPriceRange([priceRange[0], value]);
  };

  // Price range change hone par parent ko notify karta hai
  useEffect(() => {
    onPriceRangeChange(priceRange);
  }, [priceRange, onPriceRangeChange]);

  return (
    <Box sx={{ width: '100%', maxWidth: '300px' }}>
      <Typography variant="subtitle1" gutterBottom>
        Price Range
      </Typography>

      {/* Price Range Slider */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={maxPrice}
          step={100}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: 'primary.main',
            },
            '& .MuiSlider-track': {
              backgroundColor: 'primary.main',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'grey.300',
            },
          }}
        />
      </Box>

      {/* Price Input Fields */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Min Price"
          type="number"
          value={minPrice}
          onChange={handleMinPriceChange}
          size="small"
          sx={{ width: '120px' }}
          inputProps={{
            min: 0,
            max: priceRange[1],
          }}
        />

        <Typography variant="body2" color="text.secondary">
          to
        </Typography>

        <TextField
          label="Max Price"
          type="number"
          value={maxPriceInput}
          onChange={handleMaxPriceChange}
          size="small"
          sx={{ width: '120px' }}
          inputProps={{
            min: priceRange[0],
            max: maxPrice,
          }}
        />
      </Box>

      {/* Price Display */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        ₹{priceRange[0]} - ₹{priceRange[1]}
      </Typography>
    </Box>
  );
};

export default PriceRangeComponent;
