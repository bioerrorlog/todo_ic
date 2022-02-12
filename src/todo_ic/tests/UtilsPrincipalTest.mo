import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import U "../src/Utils/Principal";
import T "../src/Types";

// TODO: Motoko matcher

Debug.print("Module Test: Utils/Principal");

do {
  Debug.print("  isAnonymous returns true if principal is anononymous");

  let anonymousPrincipal : Text = "2vxsx-fae";
  let principal = Principal.fromText(anonymousPrincipal);
  assert(U.isAnonymous(principal));
};

do {
  Debug.print("  isAnonymous returns false if principal is not anononymous");

  let notAnonymousPrincipal : Text = "rrkah-fqaaa-aaaaa-aaaaq-cai";
  let principal = Principal.fromText(notAnonymousPrincipal);
  assert(not U.isAnonymous(principal));
};
