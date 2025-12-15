import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BankAPI } from '../services/apiCalls';

export const fetchRecipients = createAsyncThunk('recipients/fetchRecipients', async (_, { rejectWithValue }) => {
  try {
    const data = await BankAPI.getRecipients();
    return Array.isArray(data) ? data : (data.recipients || []);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const recipientsSlice = createSlice({
  name: 'recipients',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch recipients';
      });
  },
});

export default recipientsSlice.reducer;
