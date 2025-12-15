import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BankAPI } from '../services/apiCalls';

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async (_, { rejectWithValue }) => {
  try {
    const data = await BankAPI.getAccounts();
    return data.accounts || data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch accounts';
      });
  },
});

export default accountsSlice.reducer;
