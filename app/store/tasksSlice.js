import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import _ from "lodash";
import {denormalize, normalize} from "normalizr";
import {task} from "../api/schemas";


const initialState = {
  byId: {},
  all: {
    ids: []
  }
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    add: (state, action) => {
      const taskData = action.payload;
      const {entities, result} = normalize(taskData, task)
      state.byId = _.merge(state.byId, entities.tasks)
      state.all.ids = _.union(state.all.ids, [result])
    },
    remove: (state, action) => {
      const taskId = action.payload;
      state.byId = _.omit(state.byId, taskId)
      state.all.ids = _.filter(state.all.ids, item=>item!==taskId)
    }
  }
})


export default tasksSlice.reducer;

let f = {
  id: "qwertyuio47831",
  type: "USER/LOGIN",
  payload: {"something": "great"}
}


export const selectNumTasks = createSelector(
  ({tasks}) => tasks.byId,
  (tasks) => _.keys(tasks).length
)

export const selectTasks = createSelector(
  ({tasks}) => tasks.byId,
  ({tasks}) => tasks.all.ids,
  (tasks, taskIds) => denormalize(taskIds, [task], {tasks})
)
export const selectLastPendingTask = createSelector(
  ({tasks}) => tasks.byId,
  ({tasks}) => tasks.all.ids?.[0],
  (tasks, taskId) => {
    console.log("XX", denormalize(taskId, task, {tasks}))
    return denormalize(taskId, task, {tasks})
  }
)