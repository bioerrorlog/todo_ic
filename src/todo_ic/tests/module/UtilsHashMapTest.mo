import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

import Constants "../../src/Constants";
import U "../../src/Utils/HashMap";
import T "../../src/Types";

// TODO: Motoko matcher

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

  let expected = taskOrders;
  assert(U.getWithInitVal(input, key, Constants.emptyTaskOrders) == expected);
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

  let expected = Constants.emptyTaskOrders;
  assert(U.getWithInitVal(input, "dummy_key", Constants.emptyTaskOrders) == expected);
};

do {
  Debug.print("  hasVal returns true if key-val exists");

  let map = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  let key = "Key_1";
  let val = "Val_1";
  map.put(key, val);

  let result = U.hasVal(map, key);
  assert(result == true);
};

do {
  Debug.print("  hasVal returns false if key-val not exists");

  let map = HashMap.HashMap<Text, Text>(1, Text.equal, Text.hash);
  let key = "Key_1";
  let val = "Val_1";
  map.put(key, val);

  let result = U.hasVal(map, "dummy_key");
  assert(result == false);
};
