export const updateCartAction = (updatedCart,entityId) => {
    console.log("update cart action")
    return {
      type: 'UPDATE_CART',
      payload: updatedCart,
      entityId: entityId
    };
  };

  export const clearCartAction = () => {
    console.log("clear cart action");
    localStorage.removeItem('cart'); // Clear the cart from local storage
    return {
      type: 'CLEAR_CART',
    };
  };