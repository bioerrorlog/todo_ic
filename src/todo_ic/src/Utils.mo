import Array "mo:base/Array";
import Types "Types";

module Utils {

    type Task = Types.Task;
    type TaskText = Types.TaskText;

    public func add(tasks : [Task], task : TaskText, nextId : Nat) : [Task] {
        let fullTask : Task = {
            id = nextId;
            completed = false;
            description = task.description  // TODO: concat fullTask and task
        };
        Array.append<Task>([fullTask], tasks);
    };
};
