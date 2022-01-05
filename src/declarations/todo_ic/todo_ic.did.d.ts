import type { Principal } from '@dfinity/principal';
export interface Task {
  'id' : TaskId,
  'status' : TaskStatus,
  'taskText' : TaskText,
}
export type TaskId = bigint;
export type TaskId__1 = bigint;
export type TaskStatus = { 'done' : null } |
  { 'todo' : null } |
  { 'doing' : null };
export interface TaskText { 'title' : string, 'description' : string }
export interface TaskText__1 { 'title' : string, 'description' : string }
export interface _SERVICE {
  'addTask' : (arg_0: TaskText__1) => Promise<TaskId__1>,
  'getTasks' : () => Promise<Array<Task>>,
}
