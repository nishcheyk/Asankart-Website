import { ADD_TO_CART, REMOVE_ITEM, CLEAR_CART } from "./actionTypes";

// Initial state - cart ka default data structure
const initState = {
  addedItems: [], // Cart mein jo items hain
  total: 0, // Total price
  orderStatus: "", // Order ka status track karne ke liye
};

// Cart reducer - cart ke actions handle karta hai
const cartReducer = (state = initState, action) => {
  // Cart mein item add karne ka action
  if (action.type === ADD_TO_CART) {
    let addedItem = action.item.product; // Product data
    let itemAmount = action.item.amount; // Kitne quantity add karne hain

    // Check karta hai ki item already cart mein hai ya nahi
    let existed_item = state.addedItems.find((item) => addedItem._id === item._id);

    if (existed_item) {
      // Agar item already hai to quantity update karta hai
      let updatedQty = parseInt(existed_item.quantity) + parseInt(itemAmount);

      // Maximum 5 quantity limit check karta hai
      if (updatedQty > 5) {
        return state; // 5 se zyada allow nahi karta
      }

      // Existing item ko update karta hai
      let updatedItem = { ...existed_item, quantity: updatedQty };
      let updatedAddedItems = state.addedItems.map((item) =>
        item._id === existed_item._id ? updatedItem : item
      );

      return {
        ...state,
        addedItems: updatedAddedItems,
        total: state.total + addedItem.price * itemAmount, // Total update
      };
    } else {
      // Agar item new hai to cart mein add karta hai
      addedItem.quantity = parseInt(itemAmount);
      return {
        ...state,
        addedItems: [...state.addedItems, addedItem],
        total: state.total + addedItem.price * itemAmount, // Total update
      };
    }
  }

  // Cart se item remove karne ka action
  if (action.type === REMOVE_ITEM) {
    let existed_item = state.addedItems.find((item) => action.id === item._id);
    if (!existed_item) return state; // Agar item nahi hai to kuch nahi karta

    // Quantity reduce karta hai ya item completely remove karta hai
    if (existed_item.quantity > 1) {
      // Quantity 1 se zyada hai to reduce karta hai
      let updatedItem = { ...existed_item, quantity: existed_item.quantity - 1 };
      let updatedAddedItems = state.addedItems.map((item) =>
        item._id === existed_item._id ? updatedItem : item
      );

      return {
        ...state,
        addedItems: updatedAddedItems,
        total: state.total - existed_item.price, // Total reduce
      };
    } else {
      // Quantity 1 hai to item completely remove karta hai
      let new_items = state.addedItems.filter((item) => item._id !== action.id);
      return {
        ...state,
        addedItems: new_items,
        total: state.total - existed_item.price, // Total reduce
      };
    }
  }

  // Order confirm hone ke baad cart clear karne ka action
  if (action.type === CLEAR_CART) {
    return {
      ...state,
      addedItems: [], // Cart empty karta hai
      total: 0, // Total zero karta hai
      orderStatus: "Order Confirmed", // Status update karta hai
    };
  }

  return state; // Default state return karta hai
};

export default cartReducer;
