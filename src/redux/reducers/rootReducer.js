import { combineReducers } from 'redux';
import incrementCounterReducer from './incrementCounterReducer';
import darkModeReducer from './darkModeReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  incrementCounter: incrementCounterReducer,
  darkMode: darkModeReducer,
  cart: cartReducer,
});

export default rootReducer;
