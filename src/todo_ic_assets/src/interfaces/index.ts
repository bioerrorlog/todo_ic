import { Task } from '../../../declarations/todo_ic/todo_ic.did';

export interface ColumnState {
  id: string,
  title: string,
  taskIds: string[],
}

export interface ColumnStates {
  'backlog': ColumnState,
  'inProgress': ColumnState,
  'review': ColumnState,
  'done': ColumnState,
}

export interface TaskObj {

}

export interface TaskState {
  'tasks': {[key: string]: Task},
  'columns': ColumnStates,
}