import Principal "mo:base/Principal";

module {

  public func isAnonymous(caller: Principal) : Bool {
    Principal.equal(caller, Principal.fromText("2vxsx-fae"))
  };
};
