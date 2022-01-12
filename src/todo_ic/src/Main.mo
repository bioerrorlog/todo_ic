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
  stable var profiles : Profiles = Trie.empty();

  public shared(msg) func createUser (profile_ : ProfileUpdate) : async Result.Result<(), Error> {
  
    // Reject Anonymous Identity
    if(isAnonymous(msg.caller)) {
      return #err(#NotAuthorized);
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
        return #err(#AlreadyExists);
      };
    };
  };

  public shared(msg) func showCaller () : async Principal {
    msg.caller
  };

  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
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
