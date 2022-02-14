import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import axios from "axios";
import {createSelector, createSlice} from "@reduxjs/toolkit";
import {showFlashMessage} from "../api/helper";
import * as NetInfo from "@react-native-community/netinfo";
import {nanoid} from "nanoid/non-secure";

export const login = createAsyncThunk(
  'auth/login',
  ({email, password, site, taskId=undefined, showMessage}, thunkAPI) => {
    return axios.post('login', {email, password, site})
      .then(({data}) => {
        const {user} = data
        if(taskId){
          thunkAPI.dispatch({
            type:'tasks/remove',
            payload:taskId
          })
        }
        showMessage&&showFlashMessage({message: 'Login Success', type: 'success'})

        return thunkAPI.fulfillWithValue({user})
      })
      .catch(err => {
        console.log(err.response)
        if (!(err.response?.status && taskId)) {
          thunkAPI.dispatch({
            type: 'tasks/add',
            payload: {
              id: nanoid(),
              type: 'auth/login',
              payload: {email, password, site}
            }
          })
          return thunkAPI.rejectWithValue({})
        }
        thunkAPI.dispatch({
          type: 'auth/logout'
        })
        showMessage&&showFlashMessage({message: err?.response?.data?.message ?? 'Invalid Credentials', type: 'error'})
        return thunkAPI.rejectWithValue({})
      })
  }
)

export const autoLogin = createAsyncThunk(
  'auth/autoLogin',
  (_, thunkAPI) => {
    const {email, password, site} = thunkAPI.getState().auth;
    thunkAPI.dispatch(login({email, password, site}))
  }
)

export const logout = () => ({
  type: 'auth/logout'
})

const initialState = {
  user: null,
  email: null,
  password: null,
  site: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.email = null
      state.password = null
      state.site = null
      state.user = null
    }
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      const {user} = action.payload;
      const {email, password, site} = action.meta.arg;
      state.email = email
      state.password = password
      state.site = site
      state.user = user
    },
  }
})

export default authSlice.reducer;


/*
*
* user opens the app
* if USER is available:
// *   if ONLINE:
*     try to login else logout.
// *   else:
// *     log in automatically without updating anything. & try to (login else logout) when internet comes.
* else:
*   ask to turn on the internet connection.
* */