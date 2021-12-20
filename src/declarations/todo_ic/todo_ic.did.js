export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'addTask' : IDL.Func([IDL.Text], [], []) });
};
export const init = ({ IDL }) => { return []; };
