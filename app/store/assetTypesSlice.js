import {createSelector, createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {assetType} from "../api/schemas";
import _ from "lodash";


export const getAssetTypes = createAsyncThunk(
  'assetTypes/getAssetTypes',
  (_, thunkAPI) => axios.get('asset-types')
    .then(res => {
      const {asset_types} = res.data;
      const {entities, result} = normalize(asset_types, [assetType])
      return thunkAPI.fulfillWithValue({assetTypes: entities.assetTypes, assetTypeIds: result})
    })
)

const initialState = {
  byId: {},
  all: {
    ids: []
  }
}


const assetTypesSlice = createSlice({
  name: 'assetTypes',
  initialState,
  extraReducers: {
    [getAssetTypes.fulfilled]: (state, action) => {
      const {assetTypes, assetTypeIds} = action.payload;

      state.byId = _.merge(state.byId, assetTypes);
      state.all.ids = _.union(state.all.ids, assetTypeIds)

    }
  }
})

export default assetTypesSlice.reducer;

export const selectAssetTypes = createSelector(
  ({assetTypes}) => assetTypes.byId,
  ({assetTypes}) => assetTypes.all.ids,
  (assetTypes, assetTypeIds) => denormalize(assetTypeIds, [assetType], {assetTypes})
)