export const idlFactory = ({ IDL }) => {
  const TaskText__1 = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  const TaskId__1 = IDL.Nat;
  const TaskId = IDL.Nat;
  const TaskStatus = IDL.Variant({
    'done' : IDL.Null,
    'todo' : IDL.Null,
    'doing' : IDL.Null,
  });
  const TaskText = IDL.Record({ 'title' : IDL.Text, 'description' : IDL.Text });
  const Task = IDL.Record({
    'id' : TaskId,
    'status' : TaskStatus,
    'taskText' : TaskText,
  });
  return IDL.Service({
    'addTask' : IDL.Func([TaskText__1], [TaskId__1], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
