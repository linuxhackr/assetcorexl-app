import {createSelector, createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {location} from "../api/schemas";
import _ from "lodash";


export const getLocations = createAsyncThunk(
  'locations/getLocations',
  ({site, systemAsset, systemId}, thunkAPI) => axios.get('locations', {params: {site, asset: systemAsset}})
    .then(res => {
      const {locations} = res.data;
      const {entities, result} = normalize(locations, [location])
      return thunkAPI.fulfillWithValue({locations: entities.locations, locationIds: result})
    })
)

const initialState = {
  byId: {},
  systems: {
  }
}


const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  extraReducers: {
    [getLocations.fulfilled]: (state, action) => {
      const {locations, locationIds} = action.payload;
      const {systemId} = action.meta.arg;
      state.byId = _.merge(state.byId, locations);
      state.systems[systemId] = {
        ids: locationIds
      }
    }
  }
})

export default locationsSlice.reducer;

export const selectLocations = createSelector(
  ({locations}) => locations.byId,
  ({locations}, systemId) => locations.systems?.[systemId]?.ids ?? [],
  (locations, locationIds) => denormalize(locationIds, [location], {locations})
)