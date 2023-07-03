import { configureStore } from '@reduxjs/toolkit';

import seasonReducer from './features/seasons/seasonSlice';
// import customerReducer from "./features/customers/customerSlice";

const store = configureStore({
  reducer: { season: seasonReducer },
});
export default store;
