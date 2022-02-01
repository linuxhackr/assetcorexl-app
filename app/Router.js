import React from "react";
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

const HeaderLeft = () => {
  return (
    <View paddingB={8} style={{height: 64}} center>
      <Image style={{height: 56, width: 170}} cover={false} assetGroup='images' assetName={'name_logo'}/>
    </View>
  )
}
const HeaderRight = () => {
  return (
    <View paddingB={8} style={{height: 64}} center>
      <Avatar size={40} backgroundColor={'rgba(235,128,52,0.37)'} containerStyle={{marginVertical: 10}} name={'Priyanshu Kumar'} labelColor={'#eb8034'}/>
    </View>
  )
}


const CoreStack = createNativeStackNavigator();

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
  <CoreStack.Navigator initialRouteName='Login'>
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
    <CoreStack.Screen
      name="Login" component={Login}
      options={{
        headerShadowVisible: false,
        headerLeft: () => <HeaderLeft/>,
        title: "",
      }}

    />
    {/*<CoreStack.Screen name="Camera" component={Login} />*/}
  </CoreStack.Navigator>
)

const Router = () => {
  return (
    <NavigationContainer>
      <CoreStackScreen/>
    </NavigationContainer>
  )
}

export default Router;