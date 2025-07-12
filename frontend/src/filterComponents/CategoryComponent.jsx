import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

// CategoryComponent - product category filter karne ke liye
const CategoryComponent = ({ selectedCategory, onCategoryChange, categories = [] }) => {
  // Default categories agar koi nahi diya gaya hai
  const defaultCategories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
    'Automotive',
    'Health',
    'Other'
  ];

  // Categories array - ya default ya props se
  const categoryList = categories.length > 0 ? categories : defaultCategories;

  return (
    <Box sx={{ minWidth: '200px' }}>
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          label="Category"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'grey.300',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
        >
          {/* Category options */}
          {categoryList.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategoryComponent;
