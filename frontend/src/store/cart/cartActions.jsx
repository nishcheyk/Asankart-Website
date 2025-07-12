import * as actionTypes from "./actionTypes";

// Cart mein item add karne ka action creator - Redux action dispatch karne ke liye
export const addToCart = (item) => {
  return {
    type: actionTypes.ADD_TO_CART, // Action type - reducer ko batata hai ki kya karna hai
    item: item, // Item data - product aur quantity information
  };
};

// Cart se item remove karne ka action creator - Redux action dispatch karne ke liye
export const removeFromCart = (id) => {
  return {
    type: actionTypes.REMOVE_ITEM, // Action type - reducer ko batata hai ki kya karna hai
    id: id, // Item ka ID jo remove karna hai - database se identify karne ke liye
  };
};

// Cart clear karne ka action creator - order confirm hone ke baad
export const clearCart = () => {
  return {
    type: actionTypes.CLEAR_CART, // Action type - reducer ko batata hai ki cart clear karna hai
  };
};
