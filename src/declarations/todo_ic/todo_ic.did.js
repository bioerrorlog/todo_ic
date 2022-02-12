export const idlFactory = ({ IDL }) => {
  const Branch = IDL.Rec();
  const List = IDL.Rec();
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
  const Result_1 = IDL.Variant({ 'ok' : TaskId, 'err' : Error });
  const TaskOrders = IDL.Record({
    'review' : IDL.Vec(TaskId),
    'done' : IDL.Vec(TaskId),
    'inProgress' : IDL.Vec(TaskId),
    'backlog' : IDL.Vec(TaskId),
  });
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
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  const Profile = IDL.Record({
    'principal' : IDL.Principal,
    'about' : IDL.Text,
    'name' : IDL.Text,
  });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, Profile), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, Profile), List));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  const Trie = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  Branch.fill(IDL.Record({ 'left' : Trie, 'size' : IDL.Nat, 'right' : Trie }));
  const Profiles = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  return IDL.Service({
    'createProfile' : IDL.Func([ProfileTemplate], [Result], []),
    'createTask' : IDL.Func([CreateTaskTemplate], [Result_1], []),
    'getGlobalTaskOrders' : IDL.Func([], [TaskOrders], ['query']),
    'getMyTaskOrders' : IDL.Func([], [TaskOrders], ['query']),
    'initialize' : IDL.Func([], [], []),
    'listAllTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'listProfiles' : IDL.Func([], [Profiles], ['query']),
    'showCaller' : IDL.Func([], [IDL.Text], ['query']),
    'updateProfile' : IDL.Func([ProfileTemplate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
