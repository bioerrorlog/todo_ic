import Debug "mo:base/Debug";

module Types {

  public type TaskId = Nat;

  public type Task = {
    id: TaskId;
    status: TaskStatus;
    taskText: TaskText;
  };

  public type TaskText = {
    description: Text;
  };

  public type TaskStatus = {
    #todo;
    #doing;
    #done;
  };
};
