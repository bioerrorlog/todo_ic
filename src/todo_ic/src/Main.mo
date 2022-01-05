import Types "Types";
import Utils "Utils";

actor {

  type Task = Types.Task;
  type TaskId = Types.TaskId;
  type TaskText = Types.TaskText;

  var tasks : [Task] = [];
  var nextId : TaskId = 0;

  public func addTask(taskText : TaskText) : async TaskId {
    let taskId = nextId;
    tasks := Utils.add(tasks, taskText, taskId);
    nextId += 1;

    taskId;
  };

  public query func getTasks() : async [Task] {
    tasks;
  };
};
