import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import { Search } from "@mui/icons-material";

const SearchComponent = memo((props) => {
  const getSearchQuery = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <div className="filter-section">
      <TextField
        label="Search Products"
        variant="outlined"
        size="small"
        onChange={getSearchQuery}
        value={props.searchValue || ""}
        placeholder="Type to search..."
        InputProps={{
          startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />,
        }}
        sx={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '& .MuiOutlinedInput-root': {
            borderRadius: { xs: '8px', sm: '12px' },
            fontSize: { xs: '13px', sm: '14px' },
            '&:hover fieldset': {
              borderColor: '#667eea',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#764ba2',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '13px', sm: '14px' },
          },
        }}
      />
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';

export default SearchComponent;
