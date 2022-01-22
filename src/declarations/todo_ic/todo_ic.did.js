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
  const TaskId = IDL.Text;
  const TaskStatus = IDL.Variant({
    'deleted' : IDL.Null,
    'done' : IDL.Null,
    'todo' : IDL.Null,
    'doing' : IDL.Null,
  });
  const TaskState = IDL.Record({
    'id' : TaskId,
    'status' : TaskStatus,
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  const TaskId__1 = IDL.Text;
  const Result_1 = IDL.Variant({ 'ok' : TaskId__1, 'err' : Error });
  return IDL.Service({
    'createProfile' : IDL.Func([ProfileTemplate], [Result], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'listProfiles' : IDL.Func([], [Profiles], []),
    'putTask' : IDL.Func([TaskState], [Result_1], []),
    'showCaller' : IDL.Func([], [IDL.Principal], []),
    'updateProfile' : IDL.Func([ProfileTemplate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
