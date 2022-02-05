import {createSelector, createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {system} from "../api/schemas";
import _ from "lodash";


export const getSystems = createAsyncThunk(
  'systems/getSystems',
  ({site}, thunkAPI) => axios.get('systems', {params: {site}})
    .then(res => {
      const {systems} = res.data;
      const {entities, result} = normalize(systems, [system])
      return thunkAPI.fulfillWithValue({systems: entities.systems, systemIds: result})
    })
)

const initialState = {
  byId: {},
  all: {
    ids: []
  }
}


const systemsSlice = createSlice({
  name: 'systems',
  initialState,
  extraReducers: {
    [getSystems.fulfilled]: (state, action) => {
      const {systems, systemIds} = action.payload;

      state.byId = _.merge(state.byId, systems);
      state.all.ids = _.union(state.all.ids, systemIds)

    }
  }
})

export default systemsSlice.reducer;

export const selectSystems = createSelector(
  ({systems}) => systems.byId,
  ({systems}) => systems.all.ids,
  (systems, systemIds) => denormalize(systemIds, [system], {systems})
)