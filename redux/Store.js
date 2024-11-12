// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer'; // Import the combined root reducer

export const store = configureStore({
  reducer: rootReducer
});
