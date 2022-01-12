import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import Types "Types";
import Utils "Utils";

actor {

  type State = Types.State;
  type Profile = Types.Profile;
  type Error = Types.Error;
  // type UserId = Types.UserId;
  // type PrincipalUser = Types.PrincipalUser;

  stable var state : State = {
    taskState = Trie.empty();
    profiles = Trie.empty();
  };
  // stable var principalUser : PrincipalUser = Trie.empty();

  public shared(msg) func createUser (profile_ : Profile) : async Result.Result<(), Error> {
  
    // Reject Anonymous Identity
    if(isAnonymous(msg.caller)) {
      return #err(#NotAuthorized);
    };
  
    let (newProfiles, existing) = Trie.put(
      state.profiles,
      keyPrincipal(profile_.principal),
      Principal.equal,
      profile_,
    );

    // If there is an original value, do not update
    switch(existing) {
      case null {
        state.profiles := newProfiles;
        return #ok(());
      };
      // Matches pattern of type - opt Profile
      case (? v) {
        return #err(#AlreadyExists);
      };
    };
  };

  // public func addTask(taskText : TaskText) : async TaskId {
  //   let taskId = nextId;
  //   tasks := Utils.add(tasks, taskText, taskId);
  //   nextId += 1;

  //   taskId;
  // };

  // public query func getTasks() : async [Task] {
  //   tasks;
  // };

  public shared(msg) func showCaller () : async Principal {
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
};
