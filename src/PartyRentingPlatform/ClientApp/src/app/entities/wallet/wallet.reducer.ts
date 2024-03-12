import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPaymentSuccess, IWallet } from "app/shared/model/wallet.model";
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from "app/shared/reducers/reducer.utils";
import { API_WALLET } from "./api-wallet";
import axios from "axios";
import { cleanEntity } from "app/shared/util/entity-utils";

const initialState: EntityState<IWallet | IPaymentSuccess> = {
    entity: null,
    errorMessage: null,
    loading: false,
    updateSuccess: false,
    entities: [],
    updating: false
}

export const createDeposit = createAsyncThunk("wallet/deposit_money_by_vnpay", async (entity: IWallet) => {
    const requestUrl = `${API_WALLET.customer.DEPOSITAPI}`
    const result = await axios.post<IWallet>(requestUrl, cleanEntity(entity));
    return result
},
    {
        serializeError: serializeAxiosError
    }
)


export const addDeposit = createAsyncThunk("wallet/add_money_to_wallet", async (entity: IPaymentSuccess) => {
    const requestUrl = `${API_WALLET.customer.ADDMONEYTOWALLETAPI}`
    const result = await axios.post<IPaymentSuccess>(requestUrl, cleanEntity(entity))
    return result
}, {
    serializeError: serializeAxiosError
})



export const WalletSlice = createEntitySlice({
    name: "wallet",
    initialState,
    extraReducers(builder) {
        builder
            .addCase(createDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.entity = action.payload.data;
            })

            .addCase(createDeposit.pending, (state, action) => {
                state.errorMessage = null;
                state.updateSuccess = false;
                state.loading = true;
            })
            .addCase(addDeposit.fulfilled, (state, action) => {
                state.loading = false;
                state.entity = action.payload.data;
                state.updateSuccess = true
            })
            .addCase(addDeposit.pending, (state, action) => {
                state.errorMessage = null;
                state.updateSuccess = false;
                state.loading = true;
            })
    },
})


export default WalletSlice.reducer