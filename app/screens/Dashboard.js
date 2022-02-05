import React from "react";
import {Button, Text, View} from "react-native-ui-lib";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../store/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(({auth})=>auth)
  return (
    <View center padding={24} style={{flexDirection:'row'}}>
      <Text style={{fontSize:16,marginRight:10, color:"rgba(0,0,0,0.37)"}}>Hi, {user.fname} {user.lname}</Text>
      <Button onPress={()=>dispatch(logout())} label='Log out' outline size={"xSmall"}/>
    </View>
  )
}

export default Dashboard;