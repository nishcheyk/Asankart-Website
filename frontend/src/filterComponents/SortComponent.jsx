import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

// SortComponent - products sort karne ke liye different options
const SortComponent = ({ selectedSort, onSortChange }) => {
  // Sort options array
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'name-a-z', label: 'Name: A to Z' },
    { value: 'name-z-a', label: 'Name: Z to A' },
    { value: 'rating-high-low', label: 'Rating: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  return (
    <Box sx={{ minWidth: '200px' }}>
      <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          label="Sort By"
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
          {/* Sort options */}
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortComponent;
