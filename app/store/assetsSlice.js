import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import {createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {denormalize, normalize} from "normalizr";
import {asset, location} from "../api/schemas";
import _ from "lodash";
import {nanoid} from "nanoid/non-secure";
import {showFlashMessage} from "../api/helper";
import * as FileSystem from 'expo-file-system';

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
  async ({
           assetId,
           typeName,
           comment,
           imageURL,
           parameters,
           taskId = undefined,
           showMessage = false
         }, thunkAPI) => {

    // CONVERTING image url to data for sending on server.
    let imageData = null
    if (imageURL) {
      imageData = await FileSystem.readAsStringAsync(imageURL, {encoding: FileSystem.EncodingType.Base64})
      imageData = "data:image/png;base64," + imageData
    }
    return axios.put(`assets/${assetId}`, {typeName, comment, parameters, imageData})
      .then(async res => {
        let assetx = res.data
        const image = assetx.imageData;
        if (image) {
          // saving image data to cache.
          const filename = FileSystem.cacheDirectory + "Asset_" + assetId + (new Date()).getMilliseconds() + ".png";
          await FileSystem.writeAsStringAsync(filename, image.replace("data:image/png;base64,", ""), {
            encoding: FileSystem.EncodingType.Base64,
          });
          assetx.imageURL = filename
        }
        const {entities, result} = normalize(_.omit(assetx, 'imageData'), asset)

        if (taskId) {
          thunkAPI.dispatch({
            type: 'tasks/remove',
            payload: taskId
          })
        } else {
          showMessage && showFlashMessage({message: `Asset ${entities.assets[assetId].name} updated`, type: 'success'})
        }

        return thunkAPI.fulfillWithValue({assets: entities.assets})

      }).catch(async err => {
        console.log("ERROR", err)
        if (!(err.response?.status)) {
          if (!taskId) {
            thunkAPI.dispatch({
              type: 'tasks/add',
              payload: {
                id: nanoid(),
                type: 'assets/updateAsset',
                payload: {assetId, typeName, comment, imageURL, showMessage}
              }
            })
            showMessage && showFlashMessage({message: `No internet, Added to queue!`, type: 'info'})

            return thunkAPI.rejectWithValue({})
          }
        } else {
          if (taskId) {
            thunkAPI.dispatch({
              type: 'tasks/remove',
              payload: taskId
            })
            showMessage && showFlashMessage({message: `Error: updating db.`, type: 'error'})
          }

        }
        throw Error

      })
  }
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
    [updateAsset.fulfilled]: (state, action) => {
      const {assets} = action.payload;
      state.byId = _.merge(state.byId, assets);
    },
    [updateAsset.rejected]:(state,action) => {
      const {assetId,
        typeName,
        comment,
        imageURL,
        parameters,} = action.meta.arg;
      if(state.byId?.[assetId]){
        state.byId[assetId] = _.merge(state.byId[assetId], {
          comments:comment,
          type:typeName,
          imageURL,
          parameters
        })
      }
    }
  }
})

export default assetsSlice.reducer;

export const selectAssets = createSelector(
  ({assets}) => assets.byId,
  ({assets}, systemId) => assets.locations?.[systemId]?.ids ?? [],
  (assets, assetIds) => denormalize(assetIds, [asset], {assets})
)


/*
*
* todo save captured image into cache & pass as imageURL.
*
* */