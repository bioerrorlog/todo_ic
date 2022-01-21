import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import Types "Types";
import Utils "Utils";

actor {

  type TaskStates = Types.TaskStates;
  type Profiles = Types.Profiles;
  type Profile = Types.Profile;
  type ProfileUpdate = Types.ProfileUpdate;
  type Error = Types.Error;

  stable var taskStates: TaskStates = Trie.empty();

  // TODO: Hide Principal from user, use userId instead.
  stable var profiles : Profiles = Trie.empty();

  public shared(msg) func createUser (profile_ : ProfileUpdate) : async Result.Result<(), Error> {
  
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

  public shared(msg) func updateUser (profile_ : ProfileUpdate) : async Result.Result<(), Error> {
    // TODO refactor: remove duplications to createUser

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

  public shared(msg) func listProfiles () : async Profiles {
    // TODO: convert to array
    profiles
  };

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

  // Debug
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
