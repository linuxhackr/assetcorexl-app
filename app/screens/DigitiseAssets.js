import React, {useEffect, useState} from 'react'
import {StyleSheet, ListRenderItem, Keyboard} from 'react-native'
import {Dialog, Picker, View, Colors, Text, PanningProvider, Incubator, Button, LoaderScreen} from 'react-native-ui-lib'
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view'
import PickerItem from "react-native-web/dist/exports/Picker/PickerItem";
import {ScrollView} from 'react-native';

import chevronDown from '../../assets/icons/chevronDown.png'
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {getAssetTypes} from "../store/assetTypesSlice";
import {getSystems, selectSystems} from "../store/systemsSlice";
import {getLocations, selectLocations} from "../store/locationsSlice";
import store from "../store";
import {selectAssetTypes} from "../store/assetTypesSlice";
import {getAssets, selectAssets, updateAsset} from "../store/assetsSlice";

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
  }, [])

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

  useEffect(() => {
    if(asset) {
      const assetObj = store.getState().assets.byId[asset.value]
      const ast = assetTypes[_.findIndex(assetTypes, item=>item.name===assetObj.type)]
      if (ast) {
        setAssetType({value: ast?.id, label:ast.description})
      }
      setComment(assetObj.comments)

      let params = []
      _.forEach(assetObj.parameters, item=>{
        params = params.concat({
          'label':item.name,
          'value':''
        })
        setParameters(params)

      })

    } else {
      setAssetType(null);
      setComment("")
      setParameters([])
    }
  }, [asset])




  const handleUpdate = () => {
    setLoading(true)
    dispatch(updateAsset({assetId:asset.value, comment, typeName:store.getState().assetTypes?.byId?.[assetType.value]?.name}))
      .then(Res=>{
        setLoading(false)
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
            <View padding={12} borderRadius={8}>
              <Picker
                value={system}
                onChange={setSystem}
                rightIconSource={chevronDown}
                title="System"
                containerStyle={{height:72}}
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
                containerStyle={{height:72}}
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
                containerStyle={{height:72}}
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
                containerStyle={{height:72}}
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
                style={{height: 48, textAlign: 'left', textAlignVertical: 'top', paddingTop: 0}}
                value={comment}
                onChangeText={setComment}
              />
              <View row style={{marginVertical: 16}}>
              {/*  <Button marginB={16} label='Add Photo' outline size={"small"} outlineColor={COLOR_MAIN}/>*/}
              </View>

              <Button onPress={handleUpdate} disabled={!(asset)} label='Save Asset' outlineWidth backgroundColor={COLOR_MAIN}/>


            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab label='Parameters' name="Parameters">
          <Tabs.ScrollView>
            <View padding={12} borderRadius={8}>
              {parameters.map(parameter => (
                <TextField
                  key={parameter.label}
                  label={parameter.label}
                  labelColor={{default: COLOR_MAIN}}
                  placeholder={`Enter ${parameter.label}`}
                  validateOnChange
                  labelStyle={{
                    fontWeight: 'bold'
                  }}
                  fieldStyle={styles.fieldStyle}
                  containerStyle={{marginTop: 8}}
                />

              ))}
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
      {loading && <LoaderScreen color={COLOR_MAIN} message="Loading..." overlay backgroundColor={"rgba(255,255,255,0.6)"}/>}

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