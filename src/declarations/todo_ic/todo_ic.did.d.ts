import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, Profile], List]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
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
export type TaskStatus = { 'deleted' : null } |
  { 'done' : null } |
  { 'todo' : null } |
  { 'doing' : null };
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface _SERVICE {
  'createProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
  'greet' : (arg_0: string) => Promise<string>,
  'listProfiles' : () => Promise<Profiles>,
  'putTask' : (arg_0: Task) => Promise<Result_1>,
  'showCaller' : () => Promise<Principal>,
  'updateProfile' : (arg_0: ProfileTemplate) => Promise<Result>,
}
