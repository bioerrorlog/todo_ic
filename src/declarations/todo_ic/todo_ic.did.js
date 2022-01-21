export const idlFactory = ({ IDL }) => {
  const Branch = IDL.Rec();
  const List = IDL.Rec();
  const ProfileUpdate = IDL.Record({ 'about' : IDL.Text, 'name' : IDL.Text });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
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
  return IDL.Service({
    'createUser' : IDL.Func([ProfileUpdate], [Result], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'listProfiles' : IDL.Func([], [Profiles], []),
    'showCaller' : IDL.Func([], [IDL.Principal], []),
    'updateUser' : IDL.Func([ProfileUpdate], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
