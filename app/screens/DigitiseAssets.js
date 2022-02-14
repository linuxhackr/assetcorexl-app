import React, {useEffect, useState} from 'react'
import {StyleSheet, ListRenderItem, Keyboard, Platform} from 'react-native'
import {
  Dialog,
  Picker,
  View,
  Colors,
  Text,
  PanningProvider,
  Incubator,
  Button,
  LoaderScreen,
  Image
} from 'react-native-ui-lib'
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view'

import chevronDown from '../../assets/icons/chevronDown.png'
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {getSystems, selectSystems} from "../store/systemsSlice";
import {getLocations, selectLocations} from "../store/locationsSlice";
import store from "../store";
import {selectAssetTypes} from "../store/assetTypesSlice";
import {getAssets, selectAssets, updateAsset} from "../store/assetsSlice";
import * as ImagePicker from 'expo-image-picker';

const {TextField} = Incubator;

const COLOR_MAIN = "#eb8034"

const DigitiseAssets = () => {
  const dispatch = useDispatch()
  const assetTypes = useSelector(selectAssetTypes)
  const {site} = useSelector(({auth}) => auth)

  const systems = useSelector(selectSystems)
  const [system, setSystem] = useState(null)

  const locations = useSelector((state) => selectLocations(state, system?.value))
  const [location, setLocation] = useState(null)

  const assets = useSelector((state) => selectAssets(state, location?.value))
  const [asset, setAsset] = useState(null)

  const [assetType, setAssetType] = useState(null)
  const [comment, setComment] = useState(null)
  const [image, setImage] = useState(null)
  const [parameters, setParameters] = useState([])

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    (async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }

    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result?.uri) {
      setLoading(true)

      dispatch(updateAsset({
        assetId: asset.value,
        imageURL: result.uri,
        showMessage: true
      }))
        .then(res => {
          setLoading(false)
          onAssetChange()
        })
    } else {
      console.log('no image selected')
    }

  };

  useEffect(() => {
    if (system) {
      const systemObj = store.getState().systems.byId[system.value]
      dispatch(getLocations({site, systemId: systemObj.id, systemAsset: systemObj.asset}))
    }
    setLocation(null)
  }, [system])

  useEffect(() => {
    if (location) {
      const locationObj = store.getState().locations.byId[location.value]
      dispatch(getAssets({site, locationId: locationObj.id, locationAsset: locationObj.asset}))
    }
    setAsset(null)
  }, [location])

  const onAssetChange = () => {
    if (asset) {
      console.log("ON_ASSET_CHANGE")
      const assetObj = store.getState().assets.byId[asset.value]
      const ast = assetTypes[_.findIndex(assetTypes, item => item.name === assetObj.type)]
      if (ast) {
        setAssetType({value: ast?.id, label: ast.description})
      }
      setComment(assetObj.comments)

      let params = []
      _.forEach(assetObj.parameters, item => {
        params = params.concat(item)
        setParameters(params)

      })

      console.log("US", assetObj)

      setImage(assetObj.imageURL)

    } else {
      setAssetType(null);
      setComment("")
      setParameters([])
    }

  }

  useEffect(() => {
    onAssetChange();
    if(asset) {
      setLoading(true)
      dispatch(updateAsset({
        assetId: asset.value,
      }))
        .then(res => {
          setLoading(false)
          onAssetChange()
        })
    }

  }, [asset])


  const handleUpdate = () => {
    setLoading(true)
    dispatch(updateAsset({
      assetId: asset.value,
      parameters,
      comment,
      typeName: store.getState().assetTypes?.byId?.[assetType.value]?.name,
      showMessage: true
    }))
      .then(res => {
        setLoading(false)
        onAssetChange()
      })
  }


  return (
    <View style={{backgroundColor: '#fff', height: "100%"}}>
      <Tabs.Container
        renderTabBar={(props) => (
          <MaterialTabBar
            scrollEnabled
            {...props}
            labelStyle={{
              fontSize: 16,
              fontWeight: "bold",
            }}
            indicatorStyle={{backgroundColor: COLOR_MAIN}}
          />
        )}
      >
        <Tabs.Tab label='Details' name="Details">
          <Tabs.ScrollView keyboardShouldPersistTaps="always">
            <View padding={4}>
              <Picker
                value={system}
                onChange={setSystem}
                rightIconSource={chevronDown}
                title="System"
                containerStyle={{height: 72}}
                titleColor={COLOR_MAIN}
                placeholder={"Select System"}
              >
                {systems.map(s => (
                  <Picker.Item key={s.name} label={s.name} value={s.id}/>
                ))}
              </Picker>
              <Picker
                value={location}
                onChange={setLocation}
                rightIconSource={chevronDown}
                title="Location"
                containerStyle={{height: 72}}
                titleColor={COLOR_MAIN}
                placeholder={"Select Location"}
              >
                {locations?.map(
                  l => <Picker.Item key={l.name} label={l.name} value={l.id}/>
                )}
              </Picker>
              <Picker
                value={asset}
                onChange={setAsset}
                rightIconSource={chevronDown}
                title="Asset"
                containerStyle={{height: 72}}
                titleColor={COLOR_MAIN}
                placeholder={"Select Asset"}
              >
                {assets.map(as => <Picker.Item key={as.name} label={as.name} value={as.id}/>)}

              </Picker>
              <Picker
                value={assetType}
                onChange={setAssetType}
                rightIconSource={chevronDown}
                showSearch
                searchPlaceholder="Search Asset Types by Name"
                title="Asset Type"
                containerStyle={{height: 72}}
                titleColor={COLOR_MAIN}
                placeholder={"Select Asset Type"}

              >
                {assetTypes.map(at => <Picker.Item key={at.name} label={at.description} value={at.id}/>)}


              </Picker>

              <TextField
                label="Comment"
                labelColor={{default: COLOR_MAIN}}
                placeholder="Write comment here..."
                validateOnChange
                multiline
                fieldStyle={styles.fieldStyle}
                style={{textAlign: 'left', textAlignVertical: 'top', paddingTop: 0}}
                value={comment}
                onChangeText={setComment}
              />
              {asset &&
              <View row
                    style={{
                      marginVertical: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    paddingH-10>
                <Button
                  onPress={pickImage}
                  label='Add Photo' outline size={"small"} outlineColor={COLOR_MAIN}/>
                {image &&
                <Image source={{uri: image}}
                       style={{height: 100, width: 100}}/>}

              </View>}

              <Button marginT-10
                      onPress={handleUpdate}
                      disabled={!(asset)}
                      label='Save Asset'
                      outlineWidth
                      backgroundColor={COLOR_MAIN}/>


            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab label='Parameters' name="Parameters">
          <Tabs.ScrollView>
            <View padding={4}>
              {parameters.map((parameter, index) => (
                <TextField
                  key={parameter.id}
                  label={parameter.name}
                  labelColor={{default: COLOR_MAIN}}
                  placeholder={`Enter ${parameter.name}`}
                  validateOnChange
                  labelStyle={{
                    fontWeight: 'bold'
                  }}
                  fieldStyle={styles.fieldStyle}
                  containerStyle={{marginTop: 8}}
                  value={parameter.value}
                  onChangeText={(value) => setParameters(parameters.map((p, i) => i === index ? {...p, value} : p))}
                />

              ))}
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
      {loading &&
      <LoaderScreen color={COLOR_MAIN} message="Loading..." overlay backgroundColor={"rgba(255,255,255,0.6)"}/>}

    </View>
  )
}

const styles = StyleSheet.create({
  fieldStyle: {
    borderWidth: 1,
    borderColor: Colors.grey60,
    padding: 8,
    marginTop: 4,
    borderRadius: 0
  }
})

export default DigitiseAssets