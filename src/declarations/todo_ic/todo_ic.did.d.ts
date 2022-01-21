import type { Principal } from '@dfinity/principal';
export type AssocList = [] | [[[Key, Profile], List]];
export interface Branch { 'left' : Trie, 'size' : bigint, 'right' : Trie }
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export type Hash = number;
export interface Key { 'key' : Principal, 'hash' : Hash }
export interface Leaf { 'size' : bigint, 'keyvals' : AssocList }
export type List = [] | [[[Key, Profile], List]];
export interface Profile {
  'principal' : Principal,
  'about' : string,
  'name' : string,
}
export interface ProfileUpdate { 'about' : string, 'name' : string }
export type Profiles = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Trie = { 'branch' : Branch } |
  { 'leaf' : Leaf } |
  { 'empty' : null };
export interface _SERVICE {
  'createUser' : (arg_0: ProfileUpdate) => Promise<Result>,
  'greet' : (arg_0: string) => Promise<string>,
  'listProfiles' : () => Promise<Profiles>,
  'showCaller' : () => Promise<Principal>,
  'updateUser' : (arg_0: ProfileUpdate) => Promise<Result>,
}
