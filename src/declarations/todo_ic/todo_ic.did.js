export const idlFactory = ({ IDL }) => {
  const ProfileTemplate = IDL.Record({ 'about' : IDL.Text, 'name' : IDL.Text });
  const Error = IDL.Variant({
    'notAuthorized' : IDL.Null,
    'alreadyExists' : IDL.Null,
    'notFound' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const CreateTaskTemplate = IDL.Record({
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  const TaskId = IDL.Text;
  const Result_2 = IDL.Variant({ 'ok' : TaskId, 'err' : Error });
  const TaskOrders = IDL.Record({
    'review' : IDL.Vec(TaskId),
    'done' : IDL.Vec(TaskId),
    'inProgress' : IDL.Vec(TaskId),
    'backlog' : IDL.Vec(TaskId),
  });
  const Profile = IDL.Record({
    'principal' : IDL.Principal,
    'about' : IDL.Text,
    'name' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  const TaskStatus = IDL.Variant({
    'review' : IDL.Null,
    'deleted' : IDL.Null,
    'done' : IDL.Null,
    'inProgress' : IDL.Null,
    'backlog' : IDL.Null,
  });
  const Task = IDL.Record({
    'id' : TaskId,
    'status' : TaskStatus,
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'createProfile' : IDL.Func([ProfileTemplate], [Result], []),
    'createTask' : IDL.Func([CreateTaskTemplate], [Result_2], []),
    'getGlobalTaskOrders' : IDL.Func([], [TaskOrders], ['query']),
    'getMyProfile' : IDL.Func([], [Result_1], ['query']),
    'getMyTaskOrders' : IDL.Func([], [TaskOrders], ['query']),
    'initialize' : IDL.Func([], [], []),
    'listAllTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'listProfiles' : IDL.Func([], [IDL.Vec(Profile)], ['query']),
    'showCaller' : IDL.Func([], [IDL.Text], ['query']),
    'updateProfile' : IDL.Func([ProfileTemplate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
