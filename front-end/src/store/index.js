import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from './accountsSlice';
import recipientsReducer from './recipientsSlice';

const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    recipients: recipientsReducer,
  },
});

export default store;
