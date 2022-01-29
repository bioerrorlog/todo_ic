import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, Task], List]];
export type AssocList_1 = [] | [[[Key_1, Profile], List_1]];
export type AssocList_2 = [] | [[[Key_1, Trie_3], List_3]];
export type AssocList_3 = [] | [[[Key_2, Task__1], List_2]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export interface Branch_1 { 'left' : Trie_1, 'size' : bigint, 'right' : Trie_1 }
export interface Branch_2 { 'left' : Trie_2, 'size' : bigint, 'right' : Trie_2 }
export interface Branch_3 { 'left' : Trie_3, 'size' : bigint, 'right' : Trie_3 }
export type Error = { 'notAuthorized' : null } |
  { 'alreadyExists' : null } |
  { 'notFound' : null };
export type Hash = number;
export interface Key { 'key' : TaskId__1, 'hash' : Hash }
export interface Key_1 { 'key' : Principal, 'hash' : Hash }
export interface Key_2 { 'key' : TaskId, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export interface Leaf_1 { 'size' : bigint, 'keyvals' : AssocList_1 }
export interface Leaf_2 { 'size' : bigint, 'keyvals' : AssocList_2 }
export interface Leaf_3 { 'size' : bigint, 'keyvals' : AssocList_3 }
export type List = [] | [[[Key, Task], List]];
export type List_1 = [] | [[[Key_1, Profile], List_1]];
export type List_2 = [] | [[[Key_2, Task__1], List_2]];
export type List_3 = [] | [[[Key_1, Trie_3], List_3]];
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
export type Result_1 = { 'ok' : TaskId__1 } |
  { 'err' : Error };
export interface Task {
  'id' : TaskId,
  'status' : TaskStatus,
  'title' : string,
  'description' : string,
}
export type TaskId = string;
export type TaskId__1 = string;
export type TaskStates = { 'branch' : Branch_2 } |
  { 'leaf' : Leaf_2 } |
  { 'empty' : null };
export type TaskStatus = { 'deleted' : null } |
  { 'done' : null } |
  { 'todo' : null } |
  { 'doing' : null };
export interface Task__1 {
  'id' : TaskId,
  'status' : TaskStatus,
  'title' : string,
  'description' : string,
}
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export type Trie_1 = { 'branch' : Branch_1 } |
  { 'leaf' : Leaf_1 } |
  { 'empty' : null };
export type Trie_2 = { 'branch' : Branch_2 } |
  { 'leaf' : Leaf_2 } |
  { 'empty' : null };
export type Trie_3 = { 'branch' : Branch_3 } |
  { 'leaf' : Leaf_3 } |
  { 'empty' : null };
export interface _SERVICE {
  'createProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
  'greet' : (arg_0: string) => Promise<string>,
  'listAllTasks' : () => Promise<TaskStates>,
  'listMyTasks' : () => Promise<[] | [Trie]>,
  'listProfiles' : () => Promise<Profiles>,
  'listTasksByUserId' : (arg_0: Principal) => Promise<[] | [Trie]>,
  'putTask' : (arg_0: Task) => Promise<Result_1>,
  'showCaller' : () => Promise<Principal>,
  'updateProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
}
