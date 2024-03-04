import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IBooking, defaultValue } from 'app/shared/model/booking.model';
import API_BOOKING from './api-booking';

const initialState: EntityState<IBooking> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/bookings';

// Actions

export const getEntities = createAsyncThunk('booking/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<IBooking[]>(requestUrl);
});

export const getEntitiesForCustomer = createAsyncThunk('booking/fetch_entity_list_for_customer', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl + '/customer'}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<IBooking[]>(requestUrl);
});


export const getEntity = createAsyncThunk(
  'booking/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IBooking>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntityForCustomer = createAsyncThunk(
  'booking/fetch_entity_by_customer',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IBooking>(requestUrl);
  },
  { serializeError: serializeAxiosError },

  // 'booking/create_entity_by_customer',
  // async (entity: IBooking, thunkAPI) => {
  //   console.log(entity);
  //   const result = await axios.post<IBooking>(apiUrl + '/customer', cleanEntity(entity));
  //   // thunkAPI.dispatch(getEntities({}));
  //   return result;
  // },
  // { serializeError: serializeAxiosError },

);

export const createEntity = createAsyncThunk(
  'booking/create_entity',
  async (entity: IBooking, thunkAPI) => {
    const result = await axios.post<IBooking>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const createEntityByCustomer = createAsyncThunk(
  'booking/create_entity_by_customer',
  async (entity: IBooking, thunkAPI) => {
    console.log(entity);
    const result = await axios.post<IBooking>(apiUrl + '/customer', cleanEntity(entity));
    // thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'booking/update_entity',
  async (entity: IBooking, thunkAPI) => {
    const result = await axios.put<IBooking>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'booking/partial_update_entity',
  async (entity: IBooking, thunkAPI) => {
    const result = await axios.patch<IBooking>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'booking/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IBooking>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const getRequestOfCustomer = createAsyncThunk("booking/fetch_request_of_customer",
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${API_BOOKING.host.GETBOOKINGS}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IBooking[]>(requestUrl)
  }
)

// get booking detail customer
export const getRequestDetailOfCustomer = createAsyncThunk("booking/fetch_details_entity_of_customer", async (id: string | number) => {
  const requestUrl = `${API_BOOKING.host.GETBOOKINGS}/${id}`;
  return axios.get<IBooking>(requestUrl)
},
  { serializeError: serializeAxiosError }

  
)


export const cancelBookingForCustomer = createAsyncThunk("booking/cancle-booking-for-customer", async (id: string | number, thunkAPI) => {
  const requestUrl = await axios.put<IBooking>(`${API_BOOKING.customer.CANCELBOOKING}/${id}/cancel`);
  // thunkAPI.dispatch(filterRequestOfCustomerByStatus({ query: 1 }))
  return requestUrl;
},
  { serializeError: serializeAxiosError }
)

export const updateAcceptForRequest = createAsyncThunk("booking/confirm-request", async (id: string | number, thunkAPI) => {
  const requestUrl = await axios.put<IBooking>(`${API_BOOKING.host.ACCEPTBOOKING}/${id}/accept`);
  thunkAPI.dispatch(filterRequestOfCustomerByStatus({ query: 1 }))
  return requestUrl;
},
  { serializeError: serializeAxiosError }
)



export const updateRejectForRequest = createAsyncThunk("booking/reject-request", async (id: string | number, thunkAPI) => {
  const requestUrl = await axios.put<IBooking>(`${API_BOOKING.host.REJECTBOOKING}/${id}/reject`);
  thunkAPI.dispatch(filterRequestOfCustomerByStatus({ query: 1 }))

  return requestUrl;
},
  { serializeError: serializeAxiosError }
)

export const filterRequestOfCustomerByStatus = createAsyncThunk("booking/filter-request", async ({ query, page, size, sort }: IQueryParams) => {
  const requestUrl = await axios.get<IBooking[]>(`${API_BOOKING.host.GETBOOKINGSBYSTATUS}/${query}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`);
  return (requestUrl)
},
  { serializeError: serializeAxiosError }
)
// slice

export const BookingSlice = createEntitySlice({
  name: 'booking',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(filterRequestOfCustomerByStatus, getRequestOfCustomer, getEntities, getEntitiesForCustomer), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(updateRejectForRequest, updateAcceptForRequest, createEntity, updateEntity, partialUpdateEntity, cancelBookingForCustomer), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(filterRequestOfCustomerByStatus, getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(updateRejectForRequest, updateAcceptForRequest, createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = BookingSlice.actions;

// Reducer
export default BookingSlice.reducer;
