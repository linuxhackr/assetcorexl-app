import React, {useEffect, useRef, useState} from "react";
import {TouchableOpacity, View, StyleSheet, Dimensions, Platform, Image} from "react-native";
import {Camera as ExpoCamera} from 'expo-camera';
import {Entypo, FontAwesome, Ionicons} from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import {Modal, Text} from 'react-native-ui-lib'

export default function Camera({setCamActive, setCapturedImage}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(ExpoCamera.Constants.Type.back);

  const camera = useRef();
  const dimensions = useRef(Dimensions.get("window"));
  const screenWidth = dimensions.current.width;
  const height = Math.round((screenWidth * 16) / 9);

  const [image, setImage] = useState(null)


  useEffect(() => {
    console.log("CAM LOADED");
    (async () => {
      const {status} = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onUpload = async () => {
    if (image) {
      const manipResult = await ImageManipulator.manipulateAsync(
        image,
        [{resize: {width: 500}}],
        {compress: .6, format: ImageManipulator.SaveFormat.JPEG}
      )
      setCapturedImage(manipResult.uri);
      setCamActive(false)
    }
  }


  if (hasPermission === null) {
    return <View/>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  const snap = async () => {
    if (camera) {
      let photo = await camera.current.takePictureAsync();
      await camera.current.pausePreview()
      setImage(photo.uri)
    }
  };

  return (
    <View style={styles.container}>
      <Modal.TopBar doneLabel="Upload" title={'Capture Image'} onCancel={()=>setCamActive(false)} doneButtonProps={{disabled:!image}} onDone={onUpload}/>

      {image ? (
          <View style={{flex: 1}}>
            <Image source={{uri: image}} style={{
              height: height,
              width: "100%",
            }}/>
          </View>
        )
        :
        (
          <ExpoCamera ratio="16:9"
                      style={{
                        height: height,
                        width: "100%",
                      }}
                      type={type}
                      ref={camera}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={snap}>
                <Entypo name="circle" size={64} color="white" />
              </TouchableOpacity>

            </View>
          </ExpoCamera>

        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    margin: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  information: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    flex: 1,
  }
});