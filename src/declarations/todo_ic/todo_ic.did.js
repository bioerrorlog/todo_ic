export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'showCaller' : IDL.Func([], [IDL.Principal], []) });
};
export const init = ({ IDL }) => { return []; };
