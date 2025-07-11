import React, { memo } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Category } from "@mui/icons-material";

const categories = [
  {
    value: "all",
    label: "All Categories",
  },
  {
    value: "Smartphones",
    label: "Smartphones",
  },
  {
    value: "Laptops",
    label: "Laptops",
  },
  {
    value: "Audio",
    label: "Audio",
  },
  {
    value: "Shoes",
    label: "Shoes",
  },
  {
    value: "TVs",
    label: "TVs",
  },
  {
    value: "Cameras",
    label: "Cameras",
  },
  {
    value: "Tablets",
    label: "Tablets",
  },
  {
    value: "Drones",
    label: "Drones",
  },
  {
    value: "Wearables",
    label: "Wearables",
  },
  {
    value: "Gaming",
    label: "Gaming",
  },
  {
    value: "Home Appliances",
    label: "Home Appliances",
  },
];

const CategoryComponent = memo((props) => {
  const handleChange = (event) => {
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
        <InputLabel id="category-select-label" sx={{ fontSize: { xs: '13px', sm: '14px' } }}>Categories</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={props.categoryValue || ""}
          label="Categories"
          onChange={handleChange}
          startAdornment={<Category sx={{ color: 'text.secondary', mr: 1, fontSize: 16 }} />}
          sx={{
            '& .MuiSelect-select': {
              fontSize: { xs: '13px', sm: '14px' },
            },
            '& .MuiMenuItem-root': {
              fontSize: { xs: '13px', sm: '14px' },
            }
          }}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
});

CategoryComponent.displayName = 'CategoryComponent';

export default CategoryComponent;
