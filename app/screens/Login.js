import React from "react";
import {Colors, Incubator, Text, View, Button, Picker, Dialog, PanningProvider} from "react-native-ui-lib";
import chevronDown from "../../assets/icons/chevronDown.png";
import {ScrollView} from "react-native";

const {TextField} = Incubator;

const COLOR_MAIN = "#eb8034"



const Login = ({navigation}) => {

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
    <View col padding-16 margin-16 backgroundColor={'#fff'}>
      <Text text30>Login</Text>
      <TextField
        label="Username"
        labelColor={{default: COLOR_MAIN}}
        placeholder="Enter username"
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
        label="Password"
        labelColor={{default: COLOR_MAIN}}
        placeholder="Enter password"
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
      <Text color={COLOR_MAIN} style={{fontWeight: 'bold'}} marginT-10>Select Site</Text>

      <Picker
        value={1}
        renderCustomModal={renderDialog}
        rightIconSource={chevronDown}

      >
        <Picker.Item label={"Site A"} value={1}/>
        <Picker.Item label={"Site B"} value={2}/>
      </Picker>


      <Button onPress={()=>navigation.push('BottomTab')} label='Log In' backgroundColor={COLOR_MAIN} marginT-10/>
    </View>
  )
}

export default Login;