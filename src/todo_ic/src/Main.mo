import Array "mo:base/Array";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import Constants "Constants";
import T "Types";
import TH "TaskHandler";
import UP "Utils/Principal";

actor {

  // TODO: Stable state
  private stable var nextTaskIdSeedState : Nat = 0;
  private var taskMapState : T.TaskMap = HashMap.HashMap<T.TaskId, T.Task>(1, Text.equal, Text.hash);

  private var userTaskOrdersState : T.UserTaskOrders = HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
  private stable var grobalTaskOrdersState : T.TaskOrders = Constants.emptyTaskOrders;

  // TODO: Hide Principal from user, use userId instead.
  stable var profilesState : T.Profiles = Trie.empty();

  public shared (msg) func createProfile (profile_ : T.ProfileTemplate) : async Result.Result<(), T.Error> {
    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };
  
    let userProfile: T.Profile = {
      principal = msg.caller;
      name = profile_.name;
      about = profile_.about;
    };
  
    let (newProfiles, existing) = Trie.put(
      profilesState,
      keyPrincipal(msg.caller),
      Principal.equal,
      userProfile,
    );

    // If there is an original value, do not update
    switch(existing) {
      case null {
        profilesState := newProfiles;
        #ok(())
      };
      case (? v) {
        #err(#alreadyExists)
      };
    }
  };

  public shared (msg) func updateProfile (profile_ : T.ProfileTemplate) : async Result.Result<(), T.Error> {
    // TODO refactor: remove duplications with createUser

    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };
  
    let userProfile: T.Profile = {
      principal = msg.caller;
      name = profile_.name;
      about = profile_.about;
    };
  
    profilesState := Trie.put(
      profilesState,
      keyPrincipal(msg.caller),
      Principal.equal,
      userProfile,
    ).0;

    #ok(())
  };

  public query func listProfiles () : async T.Profiles {
    // TODO: return only necessary parts
    profilesState
  };

  public shared (msg) func createTask (taskContents_ : T.CreateTaskTemplate) : async Result.Result<T.TaskId, T.Error> {
    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };

    let (thisTask, thisTaskId) = prepareNewTask_(taskContents_);
    let newUserTaskOrders = prepareUserNewTaskOrders_(thisTaskId, msg.caller);
    let newGlobalTaskOrders = prepareGlobalNewTaskOrders_(thisTaskId);
  
    taskMapState.put(thisTaskId, thisTask);
    userTaskOrdersState.put(msg.caller, newUserTaskOrders);
    grobalTaskOrdersState := newGlobalTaskOrders;

    #ok(thisTaskId)
  };

  public query func listAllTasks () : async [T.Task] {
    Iter.toArray(taskMapState.vals())
  };

  public query func getGlobalTaskOrders () : async T.TaskOrders {
    grobalTaskOrdersState
  };

  public query (msg) func getMyTaskOrders () : async T.TaskOrders {
    if(UP.isAnonymous(msg.caller)) {
      return Constants.emptyTaskOrders;
    };
    getTaskOrdersByUserId_(msg.caller)
  };

  private func getNextTaskId_() : T.TaskId {
    nextTaskIdSeedState += 1;
    Nat.toText(nextTaskIdSeedState)
  };

  private func getTaskOrdersByUserId_(user : Principal) : T.TaskOrders {
    TH.getTaskOrdersByUserId(userTaskOrdersState, user)
  };

  private func prepareNewTask_(taskContents_ : T.CreateTaskTemplate) : (T.Task, T.TaskId) {
    let newTaskId : T.TaskId = getNextTaskId_();
    let newTask : T.Task = {
      id = newTaskId;
      title = taskContents_.title;
      description = taskContents_.description;
      status = #backlog;
    };

    (newTask, newTaskId)
  };

  private func prepareUserNewTaskOrders_(newTaskId : T.TaskId, user : Principal) : T.TaskOrders {
    let oldTaskOrders : T.TaskOrders = getTaskOrdersByUserId_(user);
    let newTaskOrders : T.TaskOrders = TH.appendTaskOrders(oldTaskOrders, newTaskId);

    newTaskOrders
  };

  private func prepareGlobalNewTaskOrders_(newTaskId : T.TaskId) : T.TaskOrders {
    let oldTaskOrders : T.TaskOrders = grobalTaskOrdersState;
    let newTaskOrders : T.TaskOrders = TH.appendTaskOrders(oldTaskOrders, newTaskId);

    newTaskOrders
  };

  private func keyPrincipal(x : Principal) : Trie.Key<Principal> {
    { key = x; hash = Principal.hash(x) }
  };

  public func initialize () : async () {
    // TODO: restrict to canister owner call

    nextTaskIdSeedState := 0;
    taskMapState := HashMap.HashMap<T.TaskId, T.Task>(1, Text.equal, Text.hash);
    userTaskOrdersState := HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
    grobalTaskOrdersState := Constants.emptyTaskOrders;
    profilesState := Trie.empty();
  };

  public query (msg) func showCaller () : async Text {
    Principal.toText(msg.caller)
  };
};
