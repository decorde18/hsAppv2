import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

const seasonSlice = createSlice({
  name: 'season',
  initialState,
  reducers: {
    getSeason(state, action) {
      state.currentSeason = action.payload;
      state.isLoading = false;
    },
  },
});

export const { getSeason } = seasonSlice.actions;

export default seasonSlice.reducer;
