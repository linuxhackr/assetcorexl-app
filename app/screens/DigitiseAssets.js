import React from 'react'
import {StyleSheet, ListRenderItem, Keyboard} from 'react-native'
import {Dialog, Picker, View, Colors, Text, PanningProvider, Incubator, Button} from 'react-native-ui-lib'
import {MaterialTabBar, Tabs} from 'react-native-collapsible-tab-view'
import PickerItem from "react-native-web/dist/exports/Picker/PickerItem";
import {ScrollView} from 'react-native';

import chevronDown from '../../assets/icons/chevronDown.png'

const {KeyboardAwareInsetsView} = Keyboard;


const {TextField} = Incubator;

const COLOR_MAIN = "#eb8034"


const DATA = [0, 1, 2, 3, 4]
const identity = (v) => v + ''

const DigitiseAssets = () => {
  const renderItem = React.useCallback(({index}) => {
    return (
      <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]}/>
    )
  }, [])

  const dialogHeader = props => {
    const {title} = props;
    return (
      <Text margin-15 text60>
        {title}
      </Text>
    );
  };

  const renderDialog = modalProps => {
    const {visible, children, toggleModal, onDone} = modalProps;

    return (
      <Dialog
        visible={visible}
        onDismiss={() => {
          onDone();
          toggleModal(false);
        }}
        width="100%"
        height="45%"
        bottom
        useSafeArea
        containerStyle={{backgroundColor: Colors.white}}
        renderPannableHeader={dialogHeader}
        panDirection={PanningProvider.Directions.DOWN}
        pannableHeaderProps={{title: "Please choose one option"}}
      >
        <ScrollView>{children}</ScrollView>
      </Dialog>
    );
  };

  return (
    <View style={{backgroundColor: '#fff', height: "100%"}}>
      <Tabs.Container

        renderTabBar={(props) => (
          <MaterialTabBar

            scrollEnabled
            {...props}
            style={{
              // backgroundColor: theme.colors.surface,
              // color: theme.colors.text,
            }}
            labelStyle={{
              // color: theme.colors.text,
              fontSize: 16,
              // fontWeight: "bold",
            }}
            // indicatorStyle={{backgroundColor: theme.colors.primary}}
          />
        )}
      >
        <Tabs.Tab label='Details' name="Details">
          <Tabs.ScrollView keyboardShouldPersistTaps="always">
            <View padding={12} borderRadius={8}>
              <Text color={COLOR_MAIN} style={{fontWeight: 'bold'}}>System</Text>
              <Picker
                value={1}
                renderCustomModal={renderDialog}

                rightIconSource={chevronDown}
              >
                <Picker.Item label={"Option A"} value={1}/>
                <Picker.Item label={"Option B"} value={2}/>
              </Picker>
              <Text color={COLOR_MAIN} style={{fontWeight: 'bold'}}>Location</Text>

              <Picker
                value={1}
                renderCustomModal={renderDialog}
                rightIconSource={chevronDown}

              >
                <Picker.Item label={"Option A"} value={1}/>
                <Picker.Item label={"Option B"} value={2}/>
              </Picker>
              <Text color={COLOR_MAIN} style={{fontWeight: 'bold'}}>Asset</Text>

              <Picker
                value={1}
                renderCustomModal={renderDialog}
                rightIconSource={chevronDown}
              >
                <Picker.Item label={"Option A"} value={1}/>
                <Picker.Item label={"Option B"} value={2}/>
              </Picker>
              <Text color={COLOR_MAIN} style={{fontWeight: 'bold'}}>Asset Type</Text>

              <Picker
                value={1}
                renderCustomModal={renderDialog}
                rightIconSource={chevronDown}
              >
                <Picker.Item label={"Option A"} value={1}/>
                <Picker.Item label={"Option B"} value={2}/>
              </Picker>

              <TextField
                label="Comment"
                labelColor={{default: COLOR_MAIN}}
                placeholder="Write comment here..."
                validateOnChange
                multiline
                labelStyle={{
                  fontWeight:'bold'
                }}
                fieldStyle={{
                  borderWidth: 1,
                  borderColor: Colors.grey60,
                  paddingHorizontal: 8,
                  marginTop: 8,
                  borderRadius: 0
                }}
                style={{height: 100, textAlign: 'left', textAlignVertical: 'top', paddingTop: 8}}
              />
              <View row style={{marginVertical: 16}}>
                <Button marginB={16} label='Add Photo' outline size={"small"} outlineColor={COLOR_MAIN}/>
              </View>

              <Button label='Save Asset' outlineWidth backgroundColor={COLOR_MAIN}/>


            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab label='Patameters' name="Parameters">
          <Tabs.ScrollView>
            <View padding={12} borderRadius={8}>
              <TextField
                label="parameter 1"
                labelColor={{default: COLOR_MAIN}}
                placeholder="Enter Parameter"
                validateOnChange
                labelStyle={{
                  fontWeight: 'bold'
                }}
                fieldStyle={{
                  borderWidth: 1,
                  borderColor: Colors.grey60,
                  padding: 8,
                  marginTop: 4,
                  borderRadius: 0
                }}
                containerStyle={{marginTop: 8}}
              />
              <TextField
                label="parameter 2"
                labelColor={{default: COLOR_MAIN}}
                placeholder="Enter Parameter"
                validateOnChange
                labelStyle={{
                  fontWeight: 'bold'
                }}
                fieldStyle={{
                  borderWidth: 1,
                  borderColor: Colors.grey60,
                  padding: 8,
                  marginTop: 4,
                  borderRadius: 0
                }}
                containerStyle={{marginTop: 8}}
              />
              <TextField
                label="parameter 3"
                labelColor={{default: COLOR_MAIN}}
                placeholder="Enter Parameter"
                validateOnChange
                labelStyle={{
                  fontWeight: 'bold'
                }}
                fieldStyle={{
                  borderWidth: 1,
                  borderColor: Colors.grey60,
                  padding: 8,
                  marginTop: 4,
                  borderRadius: 0
                }}
                containerStyle={{marginTop: 8}}
              />
              <TextField
                label="parameter 4"
                labelColor={{default: COLOR_MAIN}}
                placeholder="Enter Parameter"
                validateOnChange
                labelStyle={{
                  fontWeight: 'bold'
                }}
                fieldStyle={{
                  borderWidth: 1,
                  borderColor: Colors.grey60,
                  padding: 8,
                  marginTop: 4,
                  borderRadius: 0
                }}
                containerStyle={{marginTop: 8}}
              />
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>

    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    width: '100%',
    backgroundColor: '#2196f3',
  },
})

export default DigitiseAssets