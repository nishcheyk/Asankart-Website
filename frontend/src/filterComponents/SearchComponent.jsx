import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

// SearchComponent - products search karne ke liye
const SearchComponent = ({ onSearch, placeholder = "Search products..." }) => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search - user typing rokne ke 500ms baad search karta hai
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer
  }, [searchQuery]);

  // Debounced query change hone par parent ko notify karta hai
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Search input change handle karne ka function
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '400px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClearSearch}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '25px', // Rounded corners
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchComponent;
