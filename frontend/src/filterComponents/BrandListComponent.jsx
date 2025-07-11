import React, { memo } from "react";
import { Chip, Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

const BrandListComponent = memo((props) => {
  const allbrandList = props.allbrandList;

  const handleChanges = (index) => {
    props.onChange(index);
  };

  return (
    <div className="filter-section">
      <Typography className="filter-section-title">
        Brands
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.1,
        maxHeight: { xs: '120px', sm: '100px' },
        overflowY: 'auto',
        padding: '1px'
      }}>
        {allbrandList.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 0.2, fontSize: { xs: '13px', sm: '14px' } }}
          >
            No brands available
          </Typography>
        ) : (
          allbrandList.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleChanges(index)}
                  size="small"
                  sx={{
                    color: '#667eea',
                    '&.Mui-checked': {
                      color: '#764ba2',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    }
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '13px', sm: '14px' },
                    color: item.checked ? '#764ba2' : '#2c3e50',
                    fontWeight: item.checked ? 600 : 400,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.value}
                </Typography>
              }
              sx={{
                margin: 0,
                padding: '0px 1px',
                borderRadius: '3px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                }
              }}
            />
          ))
        )}
      </Box>

      {allbrandList.length > 0 && (
        <Box sx={{
          mt: 0.2,
          pt: 0.2,
          borderTop: '1px solid rgba(102, 126, 234, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '12px', sm: '13px' } }}>
            {allbrandList.filter(brand => brand.checked).length} selected
          </Typography>
          {allbrandList.some(brand => brand.checked) && (
            <Chip
              label="Clear"
              size="small"
              onClick={() => {
                allbrandList.forEach((_, index) => {
                  if (allbrandList[index].checked) {
                    handleChanges(index);
                  }
                });
              }}
              sx={{
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                fontSize: { xs: '11px', sm: '12px' },
                height: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                }
              }}
            />
          )}
        </Box>
      )}
    </div>
  );
});

BrandListComponent.displayName = 'BrandListComponent';

export default BrandListComponent;
