export const idlFactory = ({ IDL }) => {
  const Branch_1 = IDL.Rec();
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Trie = IDL.Rec();
  const ProfileTemplate = IDL.Record({ 'about' : IDL.Text, 'name' : IDL.Text });
  const Error = IDL.Variant({
    'notAuthorized' : IDL.Null,
    'alreadyExists' : IDL.Null,
    'notFound' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const TaskStatus = IDL.Variant({
    'deleted' : IDL.Null,
    'done' : IDL.Null,
    'todo' : IDL.Null,
    'doing' : IDL.Null,
  });
  const TaskContents = IDL.Record({
    'status' : TaskStatus,
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  const TaskId = IDL.Nat;
  const Result_1 = IDL.Variant({ 'ok' : TaskId, 'err' : Error });
  const TaskId__1 = IDL.Nat;
  const Task = IDL.Record({
    'id' : TaskId__1,
    'status' : TaskStatus,
    'title' : IDL.Text,
    'description' : IDL.Text,
  });
  const Branch = IDL.Record({
    'left' : Trie,
    'size' : IDL.Nat,
    'right' : Trie,
  });
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : TaskId, 'hash' : Hash });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, Task), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, Task), List));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  Trie.fill(
    IDL.Variant({ 'branch' : Branch, 'leaf' : Leaf, 'empty' : IDL.Null })
  );
  const Key_1 = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  const Profile = IDL.Record({
    'principal' : IDL.Principal,
    'about' : IDL.Text,
    'name' : IDL.Text,
  });
  List_1.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key_1, Profile), List_1)));
  const AssocList_1 = IDL.Opt(IDL.Tuple(IDL.Tuple(Key_1, Profile), List_1));
  const Leaf_1 = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList_1 });
  const Trie_1 = IDL.Variant({
    'branch' : Branch_1,
    'leaf' : Leaf_1,
    'empty' : IDL.Null,
  });
  Branch_1.fill(
    IDL.Record({ 'left' : Trie_1, 'size' : IDL.Nat, 'right' : Trie_1 })
  );
  const Profiles = IDL.Variant({
    'branch' : Branch_1,
    'leaf' : Leaf_1,
    'empty' : IDL.Null,
  });
  return IDL.Service({
    'createProfile' : IDL.Func([ProfileTemplate], [Result], []),
    'createTask' : IDL.Func([TaskContents], [Result_1], []),
    'fetchAllTasks' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TaskId, Task))],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'listMyTasks' : IDL.Func([], [IDL.Opt(Trie)], ['query']),
    'listProfiles' : IDL.Func([], [Profiles], ['query']),
    'listTasksByUserId' : IDL.Func([IDL.Principal], [IDL.Opt(Trie)], ['query']),
    'showCaller' : IDL.Func([], [IDL.Principal], ['query']),
    'updateProfile' : IDL.Func([ProfileTemplate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
