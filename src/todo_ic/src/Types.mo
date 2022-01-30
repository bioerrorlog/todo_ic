import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {

  public type TaskId = Nat;

  public type TaskStates = Trie.Trie2D<Principal, TaskId, Task>;

  public type Profiles = Trie.Trie<Principal, Profile>;

  public type Task = {
    id: TaskId;
    title: Text;
    description: Text;
    status: TaskStatus;
  };

  public type CreateTaskTemplate = {
    title: Text;
    description: Text;
  };

  public type TaskMap = HashMap.HashMap<TaskId, Task>;

  public type TaskStatus = {
    #backlog;
    #inProgress;
    #review
    #done;
    #deleted;
  };

  public type Profile = {
    principal: Principal;
    name: Text;
    about: Text;
  };

  public type ProfileTemplate = {
    name: Text;
    about: Text;
  };

  // TODO: Split for each use case
  public type Error = {
    #notFound;
    #alreadyExists;
    #notAuthorized;
  };
};
