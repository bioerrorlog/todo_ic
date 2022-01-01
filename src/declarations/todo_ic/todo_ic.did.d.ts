import type { Principal } from '@dfinity/principal';
export interface Task {
  'id' : bigint,
  'status' : TaskStatus,
  'taskText' : TaskText,
}
export type TaskStatus = { 'done' : null } |
  { 'todo' : null } |
  { 'doing' : null };
export interface TaskText { 'description' : string }
export interface _SERVICE {
  'addTask' : (arg_0: string) => Promise<undefined>,
  'doneTask' : () => Promise<Array<Task>>,
  'getTasks' : () => Promise<Array<Task>>,
}
