import { convertArrayToObject } from '.'
import { ColumnStates, TaskState } from '../interfaces'
import { initialColumnDataset } from '../constants'
import { todo_ic } from '../../../declarations/todo_ic'

export const fetchAllTasks = async (): Promise<TaskState> => {
  const allTasks = await todo_ic.listAllTasks()
  const globalTaskOrders = await todo_ic.getGlobalTaskOrders()

  const newColumnData: ColumnStates = {
    'backlog': { ...initialColumnDataset['backlog'], taskIds: globalTaskOrders.backlog},
    'inProgress': { ...initialColumnDataset['inProgress'], taskIds: globalTaskOrders.inProgress},
    'review': { ...initialColumnDataset['review'], taskIds: globalTaskOrders.review},
    'done': { ...initialColumnDataset['done'], taskIds: globalTaskOrders.done},
  }
  const newTaskState: TaskState = {
    'tasks': convertArrayToObject(allTasks, 'id'),
    'columns': newColumnData,
  }
  return newTaskState
}
