import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError, IQueryParamsForSearch } from 'app/shared/reducers/reducer.utils';
import { IRoom, defaultValue } from 'app/shared/model/room.model';
import API_ROOM from './api-room';

const initialState: EntityState<IRoom> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = 'api/rooms';


// Actions

export const getEntities = createAsyncThunk('room/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
  return axios.get<IRoom[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'room/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IRoom>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntityForCustomer = createAsyncThunk(
  'room/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${API_ROOM.customer.GETROOMDETAILSAPI}/${id}`;
    return axios.get<IRoom>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'room/create_entity',
  async (entity: IRoom, thunkAPI) => {
    const result = await axios.post<IRoom>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'room/update_entity',
  async (entity: IRoom, thunkAPI) => {
    const result = await axios.put<IRoom>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'room/partial_update_entity',
  async (entity: IRoom, thunkAPI) => {
    const result = await axios.patch<IRoom>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'room/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IRoom>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);


export const getEntityOfCustomers = createAsyncThunk(
  'room/fetch_entity_list_customer',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${API_ROOM.customer.GETROOMSAPI}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IRoom[]>(requestUrl);
  }
)


export const searchEntitiesForAll = createAsyncThunk("room/search_list_entities", async ({ roomName, address, rating, page, size, sort }: IQueryParamsForSearch) => {
  const requestUrlRoomNameExisted = `${API_ROOM.customer.SEARCHROOMSAPI}?${`roomName=${roomName}${address ? `&address=${address}` : ``}${rating ? `&rating=${rating}` : ``}`}${sort ? `&page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;

  return axios.get<IRoom[]>(requestUrlRoomNameExisted)

},
  { serializeError: serializeAxiosError }
)

export const getEntityOfHost = createAsyncThunk(
  'room/fetch_entity_list_hostparty', async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${API_ROOM.host.GETROOMSAPI}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IRoom[]>(requestUrl);
  }
)

export const getEntityDetailsOfHost = createAsyncThunk("room/fetch_detail_entity", async (id: string | number) => {
  const requestUrl = `${API_ROOM.host.GETDETAILSROOMAPI}/${id}`
  return axios.get<IRoom>(requestUrl);
},
  { serializeError: serializeAxiosError },
)


export const createEntityOfHost = createAsyncThunk('room/create_entity_host', async (room: IRoom, thunkAPI) => {
  const result = await axios.postForm(API_ROOM.host.CREATEROOMAPI, cleanEntity(room), {
    headers: {
      "Content-Type": 'multipart/form-data'
    }

  });
  thunkAPI.dispatch(getEntityOfHost({ page: 0, size: 5, sort: "id asc" }))
  return result
}, {
  serializeError: serializeAxiosError
}

)

export const updateEntityOfHost = createAsyncThunk("room/update_entity_host", async ({ id, room }: { id: string | number, room: IRoom }) => {
  const result = await axios.put(`${API_ROOM.host.UPDATEROOMAPI}/${id}`, room, {
  })
  return result
},
  { serializeError: serializeAxiosError }
)


export const deleteEntityOfHost = createAsyncThunk('room/delelte_entity_host', async ({ id, page }: { id: string | number, page: number }, thunkAPI) => {
  const requestUrl = `${API_ROOM.host.DELETEROOMAPI}/${id}`;
  const result = await axios.delete<IRoom>(requestUrl)
  thunkAPI.dispatch(getEntityOfHost({ page: page, size: 5, sort: "id,asc" }))
  return result
},
  {
    serializeError: serializeAxiosError
  }
)

// slice

export const RoomSlice = createEntitySlice({
  name: 'room',
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
      .addMatcher(isFulfilled(getEntityOfCustomers, getEntities), (state, action) => {
        const { data, headers } = action.payload;
        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })

      .addMatcher(isFulfilled(searchEntitiesForAll), (state, action) => {
        const data = action.payload.data
        return {
          ...state,
          loading: false,
          searchEntities: data,
        }
      })

      .addMatcher(isFulfilled(getEntityOfHost), (state, action) => {
        const { data, headers } = action.payload;

        return {
          ...state,
          loading: false,
          entitiesOfHost: data,
          totalItems: parseInt(headers['x-total-count'], 10),
        };


      })

      .addMatcher(isFulfilled(getEntityDetailsOfHost), (state, action) => {
        const { data, headers } = action.payload;
        return {
          ...state,
          loading: false,
          entityDetailsOfHost: data
        }
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity, updateEntityOfHost), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(searchEntitiesForAll, getEntityOfHost, getEntityOfCustomers, getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = RoomSlice.actions;

// Reducer
export default RoomSlice.reducer;
