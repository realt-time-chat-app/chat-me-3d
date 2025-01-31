import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/slice';
import messageReducer from './message/slice';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  messages: messageReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
