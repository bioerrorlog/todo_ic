import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {

  public type TaskId = Text;

  public type Profiles = HashMap.HashMap<Principal, Profile>;

  public type TaskOrders = {
    backlog: [TaskId];
    inProgress: [TaskId];
    review: [TaskId];
    done: [TaskId];
  };

  public type UserTaskOrders = HashMap.HashMap<Principal, TaskOrders>;

  public type CreateTaskTemplate = {
    title: Text;
    description: Text;
  };

  public type Task = CreateTaskTemplate and {
    id: TaskId;
    status: TaskStatus;
  };

  public type TaskStatus = {
    #backlog;
    #inProgress;
    #review;
    #done;
    #deleted;
  };
  
  public type TaskMap = HashMap.HashMap<TaskId, Task>;

  public type ProfileTemplate = {
    name: Text;
    about: Text;
  };

  public type Profile = ProfileTemplate and {
    principal: Principal;
  };

  public type Error = {
    #notFound;
    #alreadyExists;
    #notAuthorized;
    #profileDoesNotExists;
  };
};
