import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, Task], List]];
export type AssocList_1 = [] | [[[Key_1, Profile], List_1]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface Branch_1 { 'left' : Trie_1, 'size' : bigint, 'right' : Trie_1 }
export interface CreateTaskTemplate { 'title' : string, 'description' : string }
export type Error = { 'notAuthorized' : null } |
  { 'alreadyExists' : null } |
  { 'notFound' : null };
export type Hash = number;
export interface Key { 'key' : TaskId, 'hash' : Hash }
export interface Key_1 { 'key' : Principal, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export interface Leaf_1 { 'size' : bigint, 'keyvals' : AssocList_1 }
export type List = [] | [[[Key, Task], List]];
export type List_1 = [] | [[[Key_1, Profile], List_1]];
export interface Profile {
  'principal' : Principal,
  'about' : string,
  'name' : string,
}
export interface ProfileTemplate { 'about' : string, 'name' : string }
export type Profiles = { 'branch' : Branch_1 } |
  { 'leaf' : Leaf_1 } |
  { 'empty' : null };
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : TaskId } |
  { 'err' : Error };
export interface Task {
  'id' : TaskId__1,
  'status' : TaskStatus,
  'title' : string,
  'description' : string,
}
export type TaskId = bigint;
export type TaskId__1 = bigint;
export type TaskStatus = { 'deleted' : null } |
  { 'done' : null } |
  { 'todo' : null } |
  { 'doing' : null };
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export type Trie_1 = { 'branch' : Branch_1 } |
  { 'leaf' : Leaf_1 } |
  { 'empty' : null };
export interface _SERVICE {
  'createProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
  'createTask' : (arg_0: CreateTaskTemplate) => Promise<Result_1>,
  'fetchAllTasks' : () => Promise<Array<Task>>,
  'greet' : (arg_0: string) => Promise<string>,
  'initialize' : () => Promise<undefined>,
  'listMyTasks' : () => Promise<[] | [Trie]>,
  'listProfiles' : () => Promise<Profiles>,
  'listTasksByUserId' : (arg_0: Principal) => Promise<[] | [Trie]>,
  'showCaller' : () => Promise<Principal>,
  'updateProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
}
