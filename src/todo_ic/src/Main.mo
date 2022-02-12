import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import Constants "Constants";
import Types "Types";
import UH "Utils/HashMap";
import UP "Utils/Principal";

actor {

  type TaskStates = Types.TaskStates;
  type Task = Types.Task;
  type CreateTaskTemplate = Types.CreateTaskTemplate;
  type TaskId = Types.TaskId;
  type TaskMap = Types.TaskMap;
  type TaskOrders = Types.TaskOrders;
  type Profiles = Types.Profiles;
  type Profile = Types.Profile;
  type ProfileTemplate = Types.ProfileTemplate;
  type Error = Types.Error;

  // TODO: Stable state
  private stable var nextTaskIdSeed : Nat = 0; // TODO: uuid
  private var taskMap : TaskMap = HashMap.HashMap<TaskId, Task>(1, Text.equal, Text.hash);
  private var userTaskOrders : HashMap.HashMap<Principal, TaskOrders> = HashMap.HashMap<Principal, TaskOrders>(1, Principal.equal, Principal.hash);
  
  private stable var taskOrders : TaskOrders = Constants.emptyTaskOrders;

  stable var taskStates: TaskStates = Trie.empty();

  // TODO: Hide Principal from user, use userId instead.
  stable var profiles : Profiles = Trie.empty();

  public shared (msg) func createProfile (profile_ : ProfileTemplate) : async Result.Result<(), Error> {
    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };
  
    let userProfile: Profile = {
      principal = msg.caller;
      name = profile_.name;
      about = profile_.about;
    };
  
    let (newProfiles, existing) = Trie.put(
      profiles,
      keyPrincipal(msg.caller),
      Principal.equal,
      userProfile,
    );

    // If there is an original value, do not update
    switch(existing) {
      case null {
        profiles := newProfiles;
        #ok(())
      };
      case (? v) {
        #err(#alreadyExists)
      };
    }
  };

  public shared (msg) func updateProfile (profile_ : ProfileTemplate) : async Result.Result<(), Error> {
    // TODO refactor: remove duplications with createUser

    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };
  
    let userProfile: Profile = {
      principal = msg.caller;
      name = profile_.name;
      about = profile_.about;
    };
  
    profiles := Trie.put(
      profiles,
      keyPrincipal(msg.caller),
      Principal.equal,
      userProfile,
    ).0;

    #ok(())
  };

  public query func listProfiles () : async Profiles {
    // TODO: return only necessary parts
    profiles
  };

  public shared (msg) func createTask (taskContents_ : CreateTaskTemplate) : async Result.Result<TaskId, Error> {
    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };

    let thisTaskId : TaskId = Nat.toText(nextTaskIdSeed);
    let thisTask : Task = {
      id = thisTaskId;
      title = taskContents_.title;
      description = taskContents_.description;
      status = #backlog;
    };

    let oldTaskOrders : TaskOrders = UH.getWithInitVal(userTaskOrders, msg.caller, Constants.emptyTaskOrders);
    let newTaskOrders : TaskOrders = {
      backlog = Array.append<TaskId>(oldTaskOrders.backlog, [thisTaskId]); // TODO: Array.append is deprecated
      inProgress = oldTaskOrders.inProgress;
      review = oldTaskOrders.review;
      done = oldTaskOrders.done;
    };
  
    taskMap.put(thisTaskId, thisTask);
    userTaskOrders.put(msg.caller, newTaskOrders);
    
    taskOrders := {
      backlog = Array.append<TaskId>([thisTaskId], taskOrders.backlog); // TODO: Array.append is deprecated
      inProgress = taskOrders.inProgress;
      review = taskOrders.review;
      done = taskOrders.done;
    };

    nextTaskIdSeed += 1;
    #ok(thisTaskId)
  };

  public query func listAllTasks () : async [Task] {
    Iter.toArray(taskMap.vals())
  };

  public query func getGlobalTaskOrders () : async TaskOrders {
    taskOrders
  };

  public query (msg) func getMyTaskOrders () : async TaskOrders {
    if(UP.isAnonymous(msg.caller)) {
      return Constants.emptyTaskOrders;
    };
    UH.getWithInitVal(userTaskOrders, msg.caller, Constants.emptyTaskOrders)
  };

  public query (msg) func showCaller () : async Text {
    Principal.toText(msg.caller)
  };

  private func keyPrincipal(x : Principal) : Trie.Key<Principal> {
    { key = x; hash = Principal.hash(x) }
  };

  public func initialize () : async () {
    // Debug
    // TODO: restrict to canister owner

    nextTaskIdSeed := 0;
    taskMap := HashMap.HashMap<TaskId, Task>(1, Text.equal, Text.hash);
    userTaskOrders := HashMap.HashMap<Principal, TaskOrders>(1, Principal.equal, Principal.hash);
    taskOrders := Constants.emptyTaskOrders;
    taskStates := Trie.empty();
    profiles := Trie.empty();
  };
};
