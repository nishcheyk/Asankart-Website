import { ADD_TO_CART, REMOVE_ITEM, CLEAR_CART } from "./actionTypes";

const initState = {
  addedItems: [],
  total: 0,
  orderStatus: "", // New status field
};

const cartReducer = (state = initState, action) => {
  // Adding item to cart
  if (action.type === ADD_TO_CART) {
    let addedItem = action.item.product;
    let itemAmount = action.item.amount;

    // Find if the item already exists in the cart
    let existed_item = state.addedItems.find((item) => addedItem._id === item._id);

    if (existed_item) {
      let updatedQty = parseInt(existed_item.quantity) + parseInt(itemAmount);

      // Check for max quantity limit of 5
      if (updatedQty > 5) {
        return state; // Don't allow adding more than 5
      }

      let updatedItem = { ...existed_item, quantity: updatedQty };
      let updatedAddedItems = state.addedItems.map((item) =>
        item._id === existed_item._id ? updatedItem : item
      );

      return {
        ...state,
        addedItems: updatedAddedItems,
        total: state.total + addedItem.price * itemAmount,
      };
    } else {
      addedItem.quantity = parseInt(itemAmount);
      return {
        ...state,
        addedItems: [...state.addedItems, addedItem],
        total: state.total + addedItem.price * itemAmount,
      };
    }
  }

  // Removing item from cart
  if (action.type === REMOVE_ITEM) {
    let existed_item = state.addedItems.find((item) => action.id === item._id);
    if (!existed_item) return state;

    // Reduce quantity or remove item entirely
    if (existed_item.quantity > 1) {
      let updatedItem = { ...existed_item, quantity: existed_item.quantity - 1 };
      let updatedAddedItems = state.addedItems.map((item) =>
        item._id === existed_item._id ? updatedItem : item
      );

      return {
        ...state,
        addedItems: updatedAddedItems,
        total: state.total - existed_item.price,
      };
    } else {
      let new_items = state.addedItems.filter((item) => item._id !== action.id);
      return {
        ...state,
        addedItems: new_items,
        total: state.total - existed_item.price,
      };
    }
  }

  // Clear Cart after successful order confirmation
  if (action.type === CLEAR_CART) {
    return {
      ...state,
      addedItems: [],
      total: 0,
      orderStatus: "Order Confirmed", // Change status to order confirmed
    };
  }

  return state;
};

export default cartReducer;
