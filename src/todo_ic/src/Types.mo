import Debug "mo:base/Debug";

module Types {

  public type Task = {
    id: Nat;
    completed: Bool;
    taskText: TaskText;
  };

  public type TaskText = {
    description: Text;
  };
};
