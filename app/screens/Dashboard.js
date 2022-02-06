import React from "react";
import {Button, Text, View} from "react-native-ui-lib";
import {ScrollView} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {autoLogin, logout} from "../store/authSlice";
import {selectNumTasks, selectTasks} from "../store/tasksSlice";
import _ from 'lodash'
const Dashboard = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(({auth})=>auth)
  const numTasks = useSelector(selectNumTasks)
  const tasks = useSelector(selectTasks)
  return (
    <ScrollView center padding={24}>
      <Text style={{fontSize:16, color:"rgba(0,0,0,0.37)"}}>Hi, {user.fname} {user.lname} {numTasks}</Text>
      <Button onPress={()=>dispatch(logout())} label='Log out' outline size={"xSmall"}/>
      <Button onPress={()=>dispatch(autoLogin())} label='autologin' outline size={"xSmall"}/>
      <Button onPress={()=>dispatch({
        type:'tasks/remove',
        payload:'XRik1hqzLxQLEEMYHFjCl'
      })} label='remove' outline size={"xSmall"}/>
      {_.compact(tasks).map(task=>(
        <Text>{task.id} {task.type}</Text>
      ))}
    </ScrollView>
  )
}

export default Dashboard;