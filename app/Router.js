import React, {useEffect, useState} from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import DigitiseAssets from "./screens/DigitiseAssets";
import RCFAProgram from "./screens/RCFAProgram";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Avatar, Image, Text, View} from "react-native-ui-lib";
import {BlurView} from 'expo-blur';

import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import {StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import FlashMessage from "react-native-flash-message";
import {autoLogin, login, logout} from "./store/authSlice";
import * as NetInfo from "@react-native-community/netinfo";
import {selectLastPendingTask, selectTasks} from "./store/tasksSlice";
import _ from "lodash";
import {getAssets, updateAsset} from "./store/assetsSlice";

const HeaderLeft = () => {
  return (
    <View paddingB={8} style={{height: 64}} center>
      <Image style={{height: 56, width: 190}} cover={false} assetGroup='images' assetName={'name_logo'}/>
    </View>
  )
}
const HeaderRight = () => {
  return (
    <View paddingB={8} style={{height: 64}} center>
      <Avatar size={40}
              backgroundColor={'rgba(235,128,52,0.37)'}
              containerStyle={{marginVertical: 10}}
              name={'Priyanshu Kumar'}
              labelColor={'#eb8034'}/>
    </View>
  )
}


const CoreStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const BottomTab = createBottomTabNavigator();

const BottomTabScreen = () => (
  <BottomTab.Navigator
    screenOptions={{
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        elevation: 0,
        zIndex: 1,
        padding: 12,
        height: 72,
        backgroundColor: '#eb8034'
      },
      tabBarLabelStyle: {
        paddingBottom: 10,
        fontSize: 14
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',

    }}
    initialRouteName='DigitiseAssets'
  >
    <BottomTab.Screen name="Dashboard" component={Dashboard} options={{
      headerShown: false,
      tabBarIcon: (props) => <FontAwesome name="dashboard" {...props} />,
      // tabBarLabel: (props) => <Text {...props}>Digitize Assets</Text>,

    }}/>
    <BottomTab.Screen name="DigitiseAssets" component={DigitiseAssets} options={{
      headerShown: false,
      tabBarIcon: (props) => <FontAwesome5 name="digital-tachograph" {...props} />,
      // tabBarLabel: (props) => <Text {...props}>Digitize Assets</Text>,
      title: "Digitize Assets"
    }}/>
    <BottomTab.Screen name="RCFAProgram" component={RCFAProgram} options={{
      headerShown: false,
      tabBarIcon: (props) => <FontAwesome name="tasks" {...props} />,
      // tabBarLabel: (props) => <Text {...props}>Digitize Assets</Text>
      title: "RCFA Program"
    }}/>
  </BottomTab.Navigator>
)


const CoreStackScreen = () => (
  <CoreStack.Navigator>
    <CoreStack.Screen
      name="BottomTab"
      component={BottomTabScreen}
      options={{
        headerShadowVisible: false,
        headerLeft: () => <HeaderLeft/>,
        title: "",
        headerRight: () => <HeaderRight/>,
      }}
    />
    {/*<CoreStack.Screen name="Camera" component={Login} />*/}
  </CoreStack.Navigator>
)
const AuthStackScreen = () => (
  <AuthStack.Navigator initialRouteName='Login'>
    <AuthStack.Screen
      name="Login" component={Login}
      options={{
        headerShadowVisible: false,
        headerLeft: () => <HeaderLeft/>,
        title: "",
      }}

    />
    {/*<CoreStack.Screen name="Camera" component={Login} />*/}
  </AuthStack.Navigator>
)

const Router = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(({auth}) => auth)
  const lastPendingTask = useSelector(selectLastPendingTask)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    });
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isConnected && lastPendingTask) {
        if (lastPendingTask.type === 'auth/login') {
          dispatch(login({...lastPendingTask.payload, taskId: lastPendingTask.id}))
        } else if (lastPendingTask.type === 'assets/getAssets') {
          dispatch(updateAsset({...lastPendingTask.payload, taskId: lastPendingTask.id}))
        }
    }
  }, [isConnected, lastPendingTask?.id])

  // trying to login on load [after persisted data fetched.]
  useEffect(() => {
    dispatch(autoLogin())
  }, [])


  // execute pending tasks when internet comes
  // NetInfo.fetch().then((state) => {
  //   if(state.isConnected) {
  //     const pendingTasks = useSelector(selectTasks)
  //     _.forEach(pendingTasks, task=>{
  //       if(task.type==='auth/login'){
  //         dispatch(login(task.payload))
  //       }
  //     })
  //   }
  //
  // })

  return (
    <NavigationContainer>
      <FlashMessage
        style={{
          margin: 0,
          paddingTop: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        icon='auto' titleStyle={{fontSize: 16}} position='top'/>
      {user === null ? <AuthStackScreen/> : <CoreStackScreen/>}
      <View backgroundColor={isConnected ? '#0077cc' : '#ff4646'} height={5}/>
    </NavigationContainer>
  )
}

export default Router;


/*
* todo
*
* 1. parameters update
* 2. if OFFLINE send updateAsset to queue AWA update the redux.
* 3. in ONLINE pick tasks from queue & fetch.
* 4. image uploading
* 6. login BG image
*
*
* */