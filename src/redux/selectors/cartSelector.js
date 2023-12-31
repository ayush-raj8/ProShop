export const selectCart = (state) => {
  const localStorageCart = localStorage.getItem('cart');
  console.log('Type of localStorageCart:', typeof localStorageCart);

  const parsedLocalStorageCart = localStorageCart !== null ? JSON.parse(localStorageCart) : null;
  const parsedStateCartData = state.cart.cartData;
  console.log('Type of parsedLocalStorageCart:', typeof parsedLocalStorageCart);
  console.log('Type of parsedStateCartData:', typeof parsedStateCartData);

  return parsedLocalStorageCart !== null ? parsedLocalStorageCart : parsedStateCartData;
};
