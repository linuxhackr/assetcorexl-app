import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import axios from "axios";
import {createSelector, createSlice} from "@reduxjs/toolkit";
import {showFlashMessage} from "../api/helper";

export const login = createAsyncThunk(
  'auth/login',
  ({email, password, site}, thunkAPI) => {
    return axios.post('login', {email, password, site})
      .then(({data}) => {
        const {user, systems} = data
        return thunkAPI.fulfillWithValue({user, systems})
      })
      .catch(err => {
        thunkAPI.dispatch({
          type: 'auth/logout'
        })
        showFlashMessage({message: err?.response?.data?.message ?? 'Invalid Credentials', type: 'error'})
        return thunkAPI.rejectWithValue({})
      })
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
      const {user, systems} = action.payload;
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