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
  private stable var nextTaskIdSeed : Nat = 0;
  private var taskMap : T.TaskMap = HashMap.HashMap<T.TaskId, T.Task>(1, Text.equal, Text.hash);
  private var userTaskOrders : T.UserTaskOrders = HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
  
  private stable var grobalTaskOrders : T.TaskOrders = Constants.emptyTaskOrders;

  stable var taskStates: T.TaskStates = Trie.empty();

  // TODO: Hide Principal from user, use userId instead.
  stable var profiles : T.Profiles = Trie.empty();

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
  
    profiles := Trie.put(
      profiles,
      keyPrincipal(msg.caller),
      Principal.equal,
      userProfile,
    ).0;

    #ok(())
  };

  public query func listProfiles () : async T.Profiles {
    // TODO: return only necessary parts
    profiles
  };

  public shared (msg) func createTask (taskContents_ : T.CreateTaskTemplate) : async Result.Result<T.TaskId, T.Error> {
    if(UP.isAnonymous(msg.caller)) {
      return #err(#notAuthorized);
    };

    let (thisTask, thisTaskId) = prepareNewTask(taskContents_);
    let newTaskOrders = prepareUserNewTaskOrders_(thisTaskId, msg.caller);
  
    taskMap.put(thisTaskId, thisTask);
    userTaskOrders.put(msg.caller, newTaskOrders);
    
    grobalTaskOrders := {
      backlog = Array.append<T.TaskId>([thisTaskId], grobalTaskOrders.backlog); // TODO: Array.append is deprecated
      inProgress = grobalTaskOrders.inProgress;
      review = grobalTaskOrders.review;
      done = grobalTaskOrders.done;
    };

    #ok(thisTaskId)
  };

  public query func listAllTasks () : async [T.Task] {
    Iter.toArray(taskMap.vals())
  };

  public query func getGlobalTaskOrders () : async T.TaskOrders {
    grobalTaskOrders
  };

  public query (msg) func getMyTaskOrders () : async T.TaskOrders {
    if(UP.isAnonymous(msg.caller)) {
      return Constants.emptyTaskOrders;
    };
    TH.getTaskOrdersByUserId(userTaskOrders, msg.caller)
  };

  private func getNextTaskId() : T.TaskId {
    nextTaskIdSeed += 1;
    Nat.toText(nextTaskIdSeed)
  };

  private func prepareNewTask(taskContents_ : T.CreateTaskTemplate) : (T.Task, T.TaskId) {
    let newTaskId : T.TaskId = getNextTaskId();
    let newTask : T.Task = {
      id = newTaskId;
      title = taskContents_.title;
      description = taskContents_.description;
      status = #backlog;
    };

    (newTask, newTaskId)
  };

  private func prepareUserNewTaskOrders_(newTaskId_ : T.TaskId, user : Principal) : T.TaskOrders {
    let oldTaskOrders : T.TaskOrders = TH.getTaskOrdersByUserId(userTaskOrders, user);
    let newTaskOrders : T.TaskOrders = {
      backlog = Array.append<T.TaskId>(oldTaskOrders.backlog, [newTaskId_]); // TODO: Array.append is deprecated
      inProgress = oldTaskOrders.inProgress;
      review = oldTaskOrders.review;
      done = oldTaskOrders.done;
    };

    newTaskOrders
  };

  private func keyPrincipal(x : Principal) : Trie.Key<Principal> {
    { key = x; hash = Principal.hash(x) }
  };

  public func initialize () : async () {
    // TODO: restrict to canister owner call

    nextTaskIdSeed := 0;
    taskMap := HashMap.HashMap<T.TaskId, T.Task>(1, Text.equal, Text.hash);
    userTaskOrders := HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
    grobalTaskOrders := Constants.emptyTaskOrders;
    taskStates := Trie.empty();
    profiles := Trie.empty();
  };

  public query (msg) func showCaller () : async Text {
    Principal.toText(msg.caller)
  };
};
