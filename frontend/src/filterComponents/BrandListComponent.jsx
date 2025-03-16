import React from "react";

const BrandListComponent = (props) => {
  const allbrandList = props.allbrandList;

  const handleChanges = (index) => {
    props.onChange(index);
  };

  return (
    <div
      style={{
        padding: "1rem",
        width: "220px",
        height: "400px",
        overflow: "scroll",
        scrollbarWidth: "none",
        border: "1px solid #493D9E",
        borderRadius: "18px",
        boxShadow: "0 3px 4px rgba(0,0,0,0.1)",
        backgroundColor: "#B2A5FF",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {allbrandList.map((item, index) => (
          <label
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <label class="container">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleChanges(index)}
                value={item.value}
                style={{ width: "16px", height: "16px", borderRadius: "10px" }}
              />

              <div class="checkmark"></div>
            </label>

            <span>{item.value}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandListComponent;
