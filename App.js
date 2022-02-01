import React, {Component} from 'react';
import Router from "./app/Router";

import {Assets, Image} from 'react-native-ui-lib';

Assets.loadAssetsGroup('images', {
  name_logo: require('./assets/name_logo.png'),
});

export default function App() {
  return (
    <Router/>
  );
}