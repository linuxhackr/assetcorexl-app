import React, {useEffect} from "react";
import {Button, Text, View} from "react-native-ui-lib";
import {ScrollView} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {autoLogin, logout} from "../store/authSlice";
import {selectNumTasks, selectTasks} from "../store/tasksSlice";
import _ from 'lodash'
import {getAssetTypes} from "../store/assetTypesSlice";
import {getSystems} from "../store/systemsSlice";
const Dashboard = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(({auth})=>auth)
  const numTasks = useSelector(selectNumTasks)
  const tasks = useSelector(selectTasks)
  const {site} = useSelector(({auth}) => auth)

  useEffect(
    ()=>{
      dispatch(getAssetTypes())
      dispatch(getSystems({site}))
    },[site]
  )

  return (
    <ScrollView row center padding={24}>
      <Text style={{fontSize:16, color:"rgba(0,0,0,0.37)"}}>Hi, {user.fname} {user.lname}</Text>
      <Text onPress={()=>dispatch(logout())} style={{color:'#0077cc'}}>Log out</Text>
    </ScrollView>
  )
}

export default Dashboard;