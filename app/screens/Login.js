import React, {useEffect, useState} from "react";
import {Colors, Incubator, Text, View, Button, Picker, Dialog, PanningProvider} from "react-native-ui-lib";
import chevronDown from "../../assets/icons/chevronDown.png";
import {ScrollView, ImageBackground} from "react-native";
import axios from "axios";
import {useDispatch} from "react-redux";
import {login} from "../store/authSlice";

const {TextField} = Incubator;

const COLOR_MAIN = "#eb8034"


const Login = ({navigation}) => {

  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [site, setSite] = useState(null)
  const [sites, setSites] = useState([])

  useEffect(
    ()=>{
      axios.get('sites', {params:{email}})
        .then(res=>{
          if(res.data.sites) setSites(res.data.sites); else setSites([]);
        })
    },[email]
  )

  useEffect(()=>{
    setSite(null)
  }, [sites])

  const dialogHeader = props => {
    const {title} = props;
    return (
      <Text margin-15 text60>
        {title}
      </Text>
    );
  };

  const handleLogin = () => {
    dispatch(login({email,password,site:site.value}))
  }

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
          value={email}
          onChangeText={setEmail}
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
          value={password}
          onChangeText={setPassword}
        />

        {sites.length > 0 && (
          <View>
            <Text color={COLOR_MAIN} style={{fontWeight: 'bold'}} marginT-10>Select Site</Text>

            <Picker
            value={site}
            renderCustomModal={renderDialog}
            rightIconSource={chevronDown}
            onChange={setSite}
          >
              {sites.map(site=>(
                <Picker.Item label={site.name} value={site.id}/>
              ))}
          </Picker>
          </View>
        )}
        <Button disabled={!(email && password && site)} onPress={handleLogin} label='Log In' backgroundColor={COLOR_MAIN} marginT-10/>
      </View>
  )
}

export default Login;