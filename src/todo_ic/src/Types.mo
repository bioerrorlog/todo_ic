import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {

  // public type UserId = Text;  // Decided by users
  public type TaskId = Text;  // uuid

  // Store Principal-userId relations
  // public type PrincipalUser = Trie.Trie<Principal, UserId>;

  // stable State - contains no Principal
  // public type State = {
  //   taskState: Trie.Trie2D<Principal, TaskId, TaskState>;
  //   profiles: Trie.Trie<Principal, Profile>;
  // };
  public type TaskStates = Trie.Trie2D<Principal, TaskId, TaskState>;

  public type Profiles = Trie.Trie<Principal, Profile>;

  public type TaskState = {
    id: TaskId;
    title: Text;
    description: Text;
    status: TaskStatus;
  };

  public type TaskStatus = {
    #todo;
    #doing;
    #done;
    #deleted;
  };

  public type Profile = {
    // userId: UserId;
    principal: Principal;
    name: Text;
    about: Text;
  };

  public type ProfileUpdate = {
    name: Text;
    about: Text;
  };

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
  };
};
