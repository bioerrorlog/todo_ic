import type { Principal } from '@dfinity/principal';
export interface CreateTaskTemplate { 'title' : string, 'description' : string }
export type Error = { 'notAuthorized' : null } |
  { 'alreadyExists' : null } |
  { 'notFound' : null };
export interface Profile {
  'principal' : Principal,
  'about' : string,
  'name' : string,
}
export interface ProfileTemplate { 'about' : string, 'name' : string }
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Profile } |
  { 'err' : Error };
export type Result_2 = { 'ok' : TaskId } |
  { 'err' : Error };
export interface Task {
  'id' : TaskId,
  'status' : TaskStatus,
  'title' : string,
  'description' : string,
}
export type TaskId = string;
export interface TaskOrders {
  'review' : Array<TaskId>,
  'done' : Array<TaskId>,
  'inProgress' : Array<TaskId>,
  'backlog' : Array<TaskId>,
}
export type TaskStatus = { 'review' : null } |
  { 'deleted' : null } |
  { 'done' : null } |
  { 'inProgress' : null } |
  { 'backlog' : null };
export interface _SERVICE {
  'createProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
  'createTask' : (arg_0: CreateTaskTemplate) => Promise<Result_2>,
  'getGlobalTaskOrders' : () => Promise<TaskOrders>,
  'getMyProfile' : () => Promise<Result_1>,
  'getMyTaskOrders' : () => Promise<TaskOrders>,
  'initialize' : () => Promise<undefined>,
  'listAllTasks' : () => Promise<Array<Task>>,
  'listProfiles' : () => Promise<Array<Profile>>,
  'showCaller' : () => Promise<string>,
  'updateProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
}
