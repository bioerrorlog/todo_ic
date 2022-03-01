import { ActorSubclass } from '@dfinity/agent'
import { convertArrayToObject } from './array'
import { ColumnStates, TaskState } from '../interfaces'
import { initialColumnDataset } from '../constants'
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
