import Array "mo:base/Array";
import Types "Types";

module Utils {

  type Task = Types.Task;
  type TaskText = Types.TaskText;

  public func add(tasks : [Task], taskText_ : TaskText, nextId : Nat) : [Task] {
    let task : Task = {
      id = nextId;
      status = #todo;
      taskText = taskText_;
    };
    Array.append<Task>([task], tasks);
  };
};
