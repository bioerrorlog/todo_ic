import type { Principal } from '@dfinity/principal';
export interface Task {
  'id' : bigint,
  'completed' : boolean,
  'description' : string,
}
export interface _SERVICE {
  'addTask' : (arg_0: string) => Promise<undefined>,
  'getTasks' : () => Promise<Array<Task>>,
}
