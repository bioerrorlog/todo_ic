import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

import Constants "../src/Constants";
import TH "../src/TaskHandler";
import T "../src/Types";

// TODO: Motoko matcher

Debug.print("Module Test: TaskHandler");

do {
  Debug.print("  getTaskOrdersByUserId: If userId (Principal) linked TaskOrders exists in userTaskOrders, return it.");

  var userTaskOrders : T.UserTaskOrders = HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
  let oneTaskOrders : T.TaskOrders = {
    backlog = ["aaa", "bbb"];
    inProgress = [];
    review = ["ccc"];
    done = [];
  };
  let userId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
  userTaskOrders.put(userId, oneTaskOrders);

  let expected = oneTaskOrders;
  assert(TH.getTaskOrdersByUserId(userTaskOrders, userId) == expected);
};

do {
  Debug.print("  getTaskOrdersByUserId: If not exited, return empty TaskOrders.");

  var userTaskOrders : T.UserTaskOrders = HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
  let oneTaskOrders : T.TaskOrders = {
    backlog = ["aaa", "bbb"];
    inProgress = [];
    review = ["ccc"];
    done = [];
  };
  let userId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
  userTaskOrders.put(userId, oneTaskOrders);

  let notRegisteredUserId = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
  let expected = Constants.emptyTaskOrders;
  assert(TH.getTaskOrdersByUserId(userTaskOrders, notRegisteredUserId) == expected);
};
