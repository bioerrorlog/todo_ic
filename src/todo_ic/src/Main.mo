import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import Types "Types";
import Utils "Utils";

actor {

  type TaskStates = Types.TaskStates;
  type Task = Types.Task;
  type TaskId = Types.TaskId;
  type Profiles = Types.Profiles;
  type Profile = Types.Profile;
  type ProfileTemplate = Types.ProfileTemplate;
  type Error = Types.Error;

  stable var taskStates: TaskStates = Trie.empty();

  // TODO: Hide Principal from user, use userId instead.
  stable var profiles : Profiles = Trie.empty();

  public shared (msg) func createProfile (profile_ : ProfileTemplate) : async Result.Result<(), Error> {
  
    // Reject Anonymous Identity
    if(isAnonymous(msg.caller)) {
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
        return #ok(());
      };
      case (? v) {
        return #err(#alreadyExists);
      };
    };
  };

  public shared (msg) func updateProfile (profile_ : ProfileTemplate) : async Result.Result<(), Error> {
    // TODO refactor: remove duplications with createUser

    // Reject Anonymous Identity
    if(isAnonymous(msg.caller)) {
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

    return #ok(())
  };

  public query func listProfiles () : async Profiles {
    // TODO: return only necessary parts
    profiles
  };


  public shared (msg) func putTask (taskState_ : Task) : async Result.Result<TaskId, Error> {
    // TODO: High cost operation?
    taskStates := Trie.put2D <Principal, TaskId, Task>(
      taskStates,
      keyPrincipal(msg.caller),
      Principal.equal,
      keyText(taskState_.id),
      Text.equal,
      taskState_
    );
    #ok(taskState_.id)
  };

  public query (msg) func listMyTasks () : async ?Trie.Trie<TaskId, Task> {
    listTasksByUserId_(msg.caller)
  };

  public query (msg) func listTasksByUserId (user_ : Principal) : async ?Trie.Trie<TaskId, Task> {
    listTasksByUserId_(user_)
  };

  private func listTasksByUserId_ (user_ : Principal) : ?Trie.Trie<TaskId, Task> {
    Trie.find(
      taskStates,
      keyPrincipal(user_),
      Principal.equal,
    )
  };

  public query (msg) func showCaller () : async Principal {
    msg.caller
  };

  private func keyText(x : Text) : Trie.Key<Text> {
    { key = x; hash = Text.hash(x) }
  };

  private func keyPrincipal(x : Principal) : Trie.Key<Principal> {
    { key = x; hash = Principal.hash(x) }
  };

  private func isAnonymous(caller: Principal) : Bool {
    Principal.equal(caller, Principal.fromText("2vxsx-fae"))
  };

  // Debug
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
