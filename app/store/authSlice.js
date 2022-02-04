import {createAsyncThunk} from "@reduxjs/toolkit/src/createAsyncThunk";
import axios from "axios";
import {createSlice} from "@reduxjs/toolkit";
import {showFlashMessage} from "../api/helper";
import {showMessage} from "react-native-flash-message";

export const login = createAsyncThunk(
  'auth/login',
  ({email, password, site}, thunkAPI) => {
    return axios.post('login', {email,password,site})
      .then(({data}) => {
        const {user, systems} = data
        return thunkAPI.fulfillWithValue({user, systems, site})
      })
      .catch(err => {
        console.log(err.response.data)
        showMessage({
          message: 'message'
          // type: type,
          // position: position,
          // backgroundColor: type === "error" ? '#ff4f89' : '#19d0b4'
        })
        // showFlashMessage({message: err?.response?.data?.message??'Invalid Credentials', type: 'error'})
        return thunkAPI.rejectWithValue({})
      })
  }
)

export const logout = () => ({
  type: 'auth/logout'
})

const initialState = {
  user: null,
  username: null,
  email: null,
  site: null,
  loading: false,
  systems: []
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.user = null
      state.systems = []
    }
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true
    },
    [login.fulfilled]: (state, action) => {
      const {user, systems, site} = action.payload;
      console.log(user,systems,site)
      state.user = user
      state.site = site
      state.systems = systems
      state.loading = false
    },
    [login.rejected]: (state, action) => {
      state.loading = false
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