import React, { memo } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Sort } from "@mui/icons-material";

const sort = [
  {
    value: "Select value",
    label: "Sort by...",
  },
  {
    value: "descendingprice",
    label: "Price: High to Low",
  },
  {
    value: "ascendingprice",
    label: "Price: Low to High",
  },
  {
    value: "descendingrating",
    label: "Rating: High to Low",
  },
  {
    value: "ascendingrating",
    label: "Rating: Low to High",
  },
  {
    value: "descpricediscount",
    label: "Discount: High to Low",
  },
  {
    value: "ascpricediscount",
    label: "Discount: Low to High",
  },
];

const SortComponent = memo((props) => {
  const handleSort = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <div className="filter-section">
      <FormControl
        size="small"
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
        }}
      >
        <InputLabel id="sort-select-label" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Sort</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={props.sortValue || ""}
          label="Sort"
          onChange={handleSort}
          startAdornment={<Sort sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />}
          sx={{
            '& .MuiSelect-select': {
              fontSize: { xs: '13px', sm: '14px' },
            },
            '& .MuiMenuItem-root': {
              fontSize: { xs: '13px', sm: '14px' },
            }
          }}
        >
          {sort.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
});

SortComponent.displayName = 'SortComponent';

export default SortComponent;
