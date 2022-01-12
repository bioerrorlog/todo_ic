import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {

  public type UserId = Text;  // Decided by users
  public type TaskId = Text;  // uuid

  // Store Principal-userId relations
  public type PrincipalUser = Trie.Trie<Principal, UserId>;

  // stable State - contains no Principal
  public type State = {
    taskState: Trie2D<UserId, TaskId, TaskState>;
    profiles: Trie.Trie<UserId, Profiles>;
  };

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

  type Profile = {
    userId: UserId;
    name: Text;
    about: Text;
  };
};
