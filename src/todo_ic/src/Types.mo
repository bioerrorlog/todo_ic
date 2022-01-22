import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {

  public type TaskId = Text;

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
