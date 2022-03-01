import { ActorSubclass } from '@dfinity/agent'
import { convertArrayToObject } from './array'
import { ColumnStates, TaskState } from '../interfaces'
import { _SERVICE } from '../../../declarations/todo_ic/todo_ic.did'

export const fetchAllTasks = async (actor: ActorSubclass<_SERVICE>, oldTaskState: TaskState): Promise<TaskState> => {
  const allTasks = await actor.listAllTasks()
  const globalTaskOrders = await actor.getGlobalTaskOrders()

  const newColumnData: ColumnStates = {
    'backlog': { ...oldTaskState.columns['backlog'], taskIds: globalTaskOrders.backlog},
    'inProgress': { ...oldTaskState.columns['inProgress'], taskIds: globalTaskOrders.inProgress},
    'review': { ...oldTaskState.columns['review'], taskIds: globalTaskOrders.review},
    'done': { ...oldTaskState.columns['done'], taskIds: globalTaskOrders.done},
  }
  const newTaskState: TaskState = {
    'tasks': convertArrayToObject(allTasks, 'id'),
    'columns': newColumnData,
  }
  return newTaskState
}

export const fetchMyTaskOrders = async (actor: ActorSubclass<_SERVICE>, oldTaskState: TaskState): Promise<TaskState> => {
  // Warning: Slow response with plug agent
  console.log('fetchMyTaskOrders start')
  const myTaskOrders = await actor.getMyTaskOrders()
  console.log('End fetching')

  const newColumnData: ColumnStates  = {
    'backlog': { ...oldTaskState.columns['backlog'], taskIds: myTaskOrders.backlog},
    'inProgress': { ...oldTaskState.columns['inProgress'], taskIds: myTaskOrders.inProgress},
    'review': { ...oldTaskState.columns['review'], taskIds: myTaskOrders.review},
    'done': { ...oldTaskState.columns['done'], taskIds: myTaskOrders.done},
  }
  const newTaskState: TaskState = {
    ...oldTaskState,
    'columns': newColumnData,
  }
  return newTaskState
}
