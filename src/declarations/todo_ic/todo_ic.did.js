export const idlFactory = ({ IDL }) => {
  const TaskStatus = IDL.Variant({
    'done' : IDL.Null,
    'todo' : IDL.Null,
    'doing' : IDL.Null,
  });
  const TaskText = IDL.Record({ 'description' : IDL.Text });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'status' : TaskStatus,
    'taskText' : TaskText,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text], [], []),
    'doneTask' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
