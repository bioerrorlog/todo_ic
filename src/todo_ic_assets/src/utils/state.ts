import { convertArrayToObject } from './array'
import { ColumnStates, TaskState } from '../interfaces'
import { Task, TaskOrders } from '../../../declarations/todo_ic/todo_ic.did'

export const setTasks = (taskState: TaskState, tasks: Task[]): TaskState => {
  const newTaskState: TaskState = {
    ...taskState,
    'tasks': convertArrayToObject(tasks, 'id'),
  }
  return newTaskState
}

export const setTaskOrders = (taskState: TaskState, taskOrders: TaskOrders): TaskState => {
  const newColumnData: ColumnStates = {
    'backlog': { ...taskState.columns['backlog'], taskIds: taskOrders.backlog},
    'inProgress': { ...taskState.columns['inProgress'], taskIds: taskOrders.inProgress},
    'review': { ...taskState.columns['review'], taskIds: taskOrders.review},
    'done': { ...taskState.columns['done'], taskIds: taskOrders.done},
  }
  const newTaskState: TaskState = {
    ...taskState,
    'columns': newColumnData,
  }
  return newTaskState
}

export const convertColumnStatesToTaskOrders = (columnStates: ColumnStates): TaskOrders => {
  const taskOrders: TaskOrders = {
    'backlog': columnStates['backlog'].taskIds,
    'inProgress': columnStates['inProgress'].taskIds,
    'review': columnStates['review'].taskIds,
    'done': columnStates['done'].taskIds,
  }
  return taskOrders
}
