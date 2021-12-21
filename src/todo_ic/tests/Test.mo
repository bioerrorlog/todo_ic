import Debug "mo:base/Debug";
import Utils "../src/Utils";
import Types "../src/Types";

Debug.print("Module Test: Utils");

do {
  Debug.print("  Utils.add");

  var tasks : [Types.Task] = [];
  var nextId : Nat = 100;
  let task : Types.TaskText = {
    description = "This is description";
  };

  let tasksExpected = [
    {
      id = nextId;
      completed = false;
      description = task.description
    },
  ];
  assert(Utils.add(tasks, task, nextId) == tasksExpected);
};
