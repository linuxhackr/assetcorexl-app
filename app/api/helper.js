import React from "react";
import * as SecureStore from "expo-secure-store";
import {showMessage} from "react-native-flash-message";

export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
}

export const showFlashMessage = ({message, type="info", position="bottom"}) => showMessage({
  message: message,
  type: type,
  position: position,
  backgroundColor: type === "error" ? '#ff4f89' : '#19d0b4'
});