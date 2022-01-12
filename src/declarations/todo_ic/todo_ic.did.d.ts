import type { Principal } from '@dfinity/principal';
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export interface ProfileUpdate { 'about' : string, 'name' : string }
export type Result = { 'ok' : null } |
  { 'err' : Error };
export interface _SERVICE {
  'createUser' : (arg_0: ProfileUpdate) => Promise<Result>,
  'greet' : (arg_0: string) => Promise<string>,
  'showCaller' : () => Promise<Principal>,
}
