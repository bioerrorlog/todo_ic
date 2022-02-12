import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, Profile], List]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface CreateTaskTemplate { 'title' : string, 'description' : string }
export type Error = { 'notAuthorized' : null } |
  { 'alreadyExists' : null } |
  { 'notFound' : null };
export type Hash = number;
export interface Key { 'key' : Principal, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export type List = [] | [[[Key, Profile], List]];
export interface Profile {
  'principal' : Principal,
  'about' : string,
  'name' : string,
}
export interface ProfileTemplate { 'about' : string, 'name' : string }
export type Profiles = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : TaskId } |
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
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface _SERVICE {
  'createProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
  'createTask' : (arg_0: CreateTaskTemplate) => Promise<Result_1>,
  'getGlobalTaskOrders' : () => Promise<TaskOrders>,
  'getMyTaskOrders' : () => Promise<TaskOrders>,
  'initialize' : () => Promise<undefined>,
  'listAllTasks' : () => Promise<Array<Task>>,
  'listProfiles' : () => Promise<Profiles>,
  'showCaller' : () => Promise<string>,
  'updateProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
}
