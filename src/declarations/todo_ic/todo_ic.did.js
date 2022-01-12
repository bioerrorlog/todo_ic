export const idlFactory = ({ IDL }) => {
  const ProfileUpdate = IDL.Record({ 'about' : IDL.Text, 'name' : IDL.Text });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  return IDL.Service({
    'createUser' : IDL.Func([ProfileUpdate], [Result], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'showCaller' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
