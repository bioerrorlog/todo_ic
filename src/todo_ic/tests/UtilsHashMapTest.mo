import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

import U "../src/Utils/HashMap";
import T "../src/Types";

Debug.print("Module Test: Utils/HashMap");

do {
  Debug.print("  getWithInitVal returns its associated value if it existed");

  let input = HashMap.HashMap<Text, T.TaskOrders>(1, Text.equal, Text.hash);
  let key = "Key_1";
  let taskId : T.TaskId = "0001";
  let taskOrders : T.TaskOrders = {
    backlog = [taskId];
    inProgress = [];
    review = [];
    done = [];
  };
  input.put(key, taskOrders);
 
  let initTaskOrders : T.TaskOrders = {
    backlog = [];
    inProgress = [];
    review = [];
    done = [];
  };

  let expected = taskOrders;
  assert(U.getWithInitVal(input, key, initTaskOrders) == expected);
};

do {
  Debug.print("  getWithInitVal returns initVal if it not existed");

  let input = HashMap.HashMap<Text, T.TaskOrders>(1, Text.equal, Text.hash);
  let key = "Key_1";
  let taskId : T.TaskId = "0001";
  let taskOrders : T.TaskOrders = {
    backlog = [taskId];
    inProgress = [];
    review = [];
    done = [];
  };
  input.put(key, taskOrders);

  let initTaskOrders : T.TaskOrders = {
    backlog = [];
    inProgress = [];
    review = [];
    done = [];
  };

  let expected = initTaskOrders;
  assert(U.getWithInitVal(input, "dummy_key", initTaskOrders) == expected);
};
