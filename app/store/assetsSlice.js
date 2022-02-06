import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import {createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {asset, location} from "../api/schemas";
import _ from "lodash";
import {getLocations} from "./locationsSlice";
import thunk from "redux-thunk";
import {nanoid} from "nanoid/non-secure";

export const getAssets = createAsyncThunk(
  'assets/getAssets',
  ({site, locationAsset, locationId}, thunkAPI) => axios.get('assets', {params: {site, asset: locationAsset}})
    .then(res => {
      const {assets} = res.data;
      const {entities, result} = normalize(assets, [asset])
      return thunkAPI.fulfillWithValue({assets: entities.assets, assetIds: result})
    })
)

export const updateAsset = createAsyncThunk(
  'assets/updateAsset',
  ({assetId, typeName, comment, imageName, taskId=undefined}, thunkAPI) => axios.put(`assets/${assetId}`, {typeName, comment, imageName})
    .then(res=>{
      const {entities, result} = normalize(res.data, asset)

      if(taskId){
        thunkAPI.dispatch({
          type:'tasks/remove',
          payload:taskId
        })
      }


      return thunkAPI.fulfillWithValue({assets: entities.assets})

    }).catch(err=>{
      if (!(err.response?.status && taskId)) {
        thunkAPI.dispatch({
          type: 'tasks/add',
          payload: {
            id: nanoid(),
            type: 'assets/getAssets',
            payload: {assetId, typeName, comment, imageName}
          }
        })
        return thunkAPI.rejectWithValue({})
      }

    })
)

const initialState = {
  ids: {},
  locations: {
    0: {
      ids: []
    }
  },
}

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  extraReducers: {
    [getAssets.fulfilled]: (state, action) => {
      const {assets, assetIds} = action.payload;
      const {locationId} = action.meta.arg;
      state.byId = _.merge(state.byId, assets);
      state.locations[locationId] = {
        ids: assetIds
      }
    },
    [updateAsset.fulfilled]:(state, action) => {
      const {assets} = action.payload;
      state.byId = _.merge(state.byId, assets);
    }
  }
})

export default assetsSlice.reducer;

export const selectAssets = createSelector(
  ({assets}) => assets.byId,
  ({assets}, systemId) => assets.locations?.[systemId]?.ids ?? [],
  (assets, assetIds) => denormalize(assetIds, [asset], {assets})
)