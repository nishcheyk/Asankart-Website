import React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";

const PriceRangeComponent = (props) => {
  return (
    <React.Fragment>
      <Stack direction="row" gap={2}>
        <TextField
          sx={{ m: 1, backgroundColor: "white" }}
          label="min"
          variant="outlined"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          value={props.minPriceDinamic}
          onChange={props.handleMinPrice}
        />
        <TextField
          sx={{ m: 1, backgroundColor: "white" }}
          label="max"
          variant="outlined"
          size="small"
          InputLabelProps={{
            shrink: true,
          }}
          value={props.maxPriceDinamic}
          onChange={props.handleMaxPrice}
        />
      </Stack>

      <Slider
        sx={{
          m: 1,
          width: "95%", // Adjust width if needed
          color: "primary", // Changes the color if using the theme's primary color
          "& .MuiSlider-thumb": {
            backgroundColor: "#474e93", // Change thumb color
          },
          "& .MuiSlider-track": {
            backgroundColor: "black", // Change track color
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#bdbdbd", // Change rail color
          },
        }}
        min={props.minPrice}
        max={props.maxPrice}
        value={props.priceRange}
        onChange={props.handlePriceRange}
        valueLabelDisplay="auto"
      />
    </React.Fragment>
  );
};

export default PriceRangeComponent;
