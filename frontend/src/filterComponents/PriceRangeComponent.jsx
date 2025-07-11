import React, { memo } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AttachMoney } from "@mui/icons-material";

const PriceRangeComponent = memo((props) => {
  return (
    <div className="filter-section">
      <Typography className="filter-section-title">
        Price Range (₹)
      </Typography>

      <Box sx={{ mb: 0.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={1}
          sx={{ mb: 0.5 }}
        >
          <TextField
            label="Min ₹"
            variant="outlined"
            size="small"
            value={props.minPriceDinamic}
            onChange={props.handleMinPrice}
            InputProps={{
              startAdornment: <AttachMoney sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 } }} />,
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '& .MuiOutlinedInput-root': {
                borderRadius: { xs: '4px', sm: '6px' },
                fontSize: { xs: '12px', sm: '14px' },
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#764ba2',
                },
              },
            }}
          />
          <TextField
            label="Max ₹"
            variant="outlined"
            size="small"
            value={props.maxPriceDinamic}
            onChange={props.handleMaxPrice}
            InputProps={{
              startAdornment: <AttachMoney sx={{ color: 'text.secondary', fontSize: { xs: 12, sm: 14 } }} />,
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '& .MuiOutlinedInput-root': {
                borderRadius: { xs: '4px', sm: '6px' },
                fontSize: { xs: '12px', sm: '14px' },
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#764ba2',
                },
              },
            }}
          />
        </Stack>

        <Slider
          min={props.minPrice}
          max={props.maxPrice}
          value={props.priceRange}
          onChange={props.handlePriceRange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `₹${value}`}
          sx={{
            color: '#667eea',
            height: 2,
            '& .MuiSlider-thumb': {
              height: 12,
              width: 12,
              backgroundColor: '#764ba2',
              border: '1px solid white',
              boxShadow: '0 1px 4px rgba(118, 75, 162, 0.4)',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 2px 8px rgba(118, 75, 162, 0.6)',
              },
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              border: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: '#764ba2',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 600,
            },
          }}
        />

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 0.1,
          px: 0.1
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
            ₹{props.minPrice}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
            ₹{props.maxPrice}
          </Typography>
        </Box>
      </Box>
    </div>
  );
});

PriceRangeComponent.displayName = 'PriceRangeComponent';

export default PriceRangeComponent;
