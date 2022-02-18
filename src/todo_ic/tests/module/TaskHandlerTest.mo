import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

import Constants "../../src/Constants";
import TH "../../src/TaskHandler";
import T "../../src/Types";

// TODO: Motoko matcher

Debug.print("Module Test: TaskHandler");

func setUpUserTaskOrders () : (T.UserTaskOrders, Principal, T.TaskOrders) {
  var userTaskOrders : T.UserTaskOrders = HashMap.HashMap<Principal, T.TaskOrders>(1, Principal.equal, Principal.hash);
  let linkedTaskOrders : T.TaskOrders = {
    backlog = ["aaa", "bbb"];
    inProgress = [];
    review = ["ccc"];
    done = [];
  };
  let userId = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
  userTaskOrders.put(userId, linkedTaskOrders);

  (userTaskOrders, userId, linkedTaskOrders)
};

do {
  Debug.print("  getTaskOrdersByUserId: If userId (Principal) linked TaskOrders exists in userTaskOrders, return it.");

  let (userTaskOrders, userId, linkedTaskOrders) = setUpUserTaskOrders();

  let expected = linkedTaskOrders;
  assert(TH.getTaskOrdersByUserId(userTaskOrders, userId) == expected);
};

do {
  Debug.print("  getTaskOrdersByUserId: If not exited, return empty TaskOrders.");

  let (userTaskOrders, userId, linkedTaskOrders) = setUpUserTaskOrders();

  let notRegisteredUserId = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
  let expected = Constants.emptyTaskOrders;
  assert(TH.getTaskOrdersByUserId(userTaskOrders, notRegisteredUserId) == expected);
};

do {
  Debug.print("  appendTaskOrders returns TaskOrders: new TaskId appended to the end of backlog");

  let newTaskId = "target";
  let oldTaskOrders = {
      backlog = ["aaa"];
      inProgress = ["bbb", "ccc"];
      review = ["ddd"];
      done = ["eee", "fff", "ggg"];
    };

  let expected = {
      backlog = ["aaa", newTaskId];
      inProgress = ["bbb", "ccc"];
      review = ["ddd"];
      done = ["eee", "fff", "ggg"];
    };
  let result = TH.appendTaskOrders(oldTaskOrders, newTaskId);
  assert(result == expected);
};
