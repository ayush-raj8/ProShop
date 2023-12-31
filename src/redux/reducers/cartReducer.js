import React from 'react';
import { saveDocument, readDocument, updateDocumentFields, deleteDocument } from '../../utils/firebaseUtils';

const storedCart = localStorage.getItem('cart');
console.log('Type of storedCart:', typeof storedCart);
if (storedCart === "undefined"){
    localStorage.setItem('cart', JSON.stringify({}));
}
const initialState = {
    cartData: storedCart && (storedCart !== "undefined") ? JSON.parse(storedCart) : {},  // Load from local storage
};


const cartReducer = (state = initialState, action) => {
    console.log('Type of storedCart:', typeof storedCart);
    console.log("cart reducer", state);
    switch (action.type) {
        case 'UPDATE_CART':
            console.log('CART Reducer', action.payload);
            const newCartState = action.payload;

            // Merge the existing cart state with the new cart state
            const updatedCartState = newCartState

            // Save the updated state to local storage
            console.log("Updated cart state", updatedCartState);
            localStorage.setItem('cart', JSON.stringify(updatedCartState));
            console.log("Updated cart state set", localStorage.getItem('cart'));
            updateDocumentFields("USERS",action.entityId,{Cart:updatedCartState})
            return {
                cartData: updatedCartState, // Use updatedCartState instead of newCartState
            };
        case 'CLEAR_CART':
            console.log('CLEAR CART Reducer');
            localStorage.removeItem('cart'); // Clear the cart from local storage
            return {
                ...state,
                cartData: {}, // Set cart to an empty object
            };
        default:
            return state;
    }
};

export default cartReducer;
