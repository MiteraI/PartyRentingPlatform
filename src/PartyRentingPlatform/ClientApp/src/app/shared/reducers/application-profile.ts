import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from './reducer.utils';
import { Storage } from 'react-jhipster';

const initialState = {
  ribbonEnv: '',
  inProduction: true,
  isOpenAPIEnabled: false,
  loading: false,
  balance: 0,
  entities: [],
  vnp_ReturnUrl: ""
};

export type ApplicationProfileState = Readonly<typeof initialState>;

export const getProfile = createAsyncThunk('applicationProfile/get_profile', async () => axios.get<any>('management/info'), {
  serializeError: serializeAxiosError,
});

export const getBalance = createAsyncThunk("applicationProfile/get_balance", async () => await axios.get<any>("api/profile/balance"), {
  serializeError: serializeAxiosError
})

export const getHistoryTransactions = createAsyncThunk("applicationProfile/history_transactions", async () => await axios.get<any>("api/transactions"), {
  serializeError: serializeAxiosError
})

export const ApplicationProfileSlice = createSlice({
  name: 'applicationProfile',
  initialState: initialState as ApplicationProfileState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.ribbonEnv = data['display-ribbon-on-profiles'];
      state.inProduction = data.activeProfiles.includes('prod');
      state.isOpenAPIEnabled = data.activeProfiles.includes('api-docs');
      state.vnp_ReturnUrl = data.vnp_ReturnUrl;

      Storage.local.set("dynamic-url", data.vnp_ReturnUrl);
    });
    builder.addCase(getBalance.fulfilled, (state, action) => {
      state.loading = false
      state.balance = action.payload.data
    })
    builder.addCase(getHistoryTransactions.fulfilled, (state, action) => {
      state.loading = false
      state.entities = action.payload.data
    })
    builder.addCase(getHistoryTransactions.pending, (state, action) => {
      state.loading = true
    })
  },
});

// Reducer
export default ApplicationProfileSlice.reducer;
