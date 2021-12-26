import Types "Types";
import Utils "Utils";

actor {

  type Task = Types.Task;
  type TaskText = Types.TaskText;

  var tasks : [Task] = [];
  var nextId : Nat = 1;

  public func addTask(description_ : Text) : async () {
    let taskText : TaskText = {
      description = description_;
    };
    tasks := Utils.add(tasks, taskText, nextId);
    nextId += 1;
  };

  public query func getTasks() : async [Task] {
    tasks;
  };
};
