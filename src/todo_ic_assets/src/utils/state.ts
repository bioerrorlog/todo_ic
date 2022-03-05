import { convertArrayToObject } from './array'
import { ColumnStates, TaskState } from '../interfaces'
import { Task, TaskOrders } from '../../../declarations/todo_ic/todo_ic.did'


export const setTasks = (taskState: TaskState, tasks: Task[]) => {
  const newTaskState: TaskState = {
    ...taskState,
    'tasks': convertArrayToObject(tasks, 'id'),
  }
  return newTaskState
}

export const setTaskOrders = (taskState: TaskState, taskOrders: TaskOrders) => {
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
