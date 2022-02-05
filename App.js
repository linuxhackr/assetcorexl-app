import React, {useState} from 'react';
import Router from "./app/Router";

import {Provider} from "react-redux";
import AppLoading from "expo-app-loading";
import axios from "axios";
import store from "./app/store";
import {Assets, Image} from 'react-native-ui-lib';
import {login} from "./app/store/authSlice";

import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'

let persistor = persistStore(store);


Assets.loadAssetsGroup('images', {
  name_logo: require('./assets/AssetLogo.jpg'),
});

// const API_BASE_URL = "https://assetcorexl-api.flashbit.in/"
const API_BASE_URL = "http://192.168.1.3:8000"
axios.defaults.baseURL = API_BASE_URL;

const App = () => {

  const [isReady, setIsReady] = useState(false)

  const _startupTasks = async () => {
    // store.dispatch(login());
    // todo autologin.
    return true
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_startupTasks}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <Router/>
      </PersistGate>
    </Provider>
  );
}

export default App;