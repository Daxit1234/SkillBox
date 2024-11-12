// src/app/rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './Auth';

const rootReducer = combineReducers({
  auth: authReducer ,
});

export default rootReducer;
