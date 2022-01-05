import Debug "mo:base/Debug";

module Types {

  public type Task = {
    id: TaskId;
    status: TaskStatus;
    taskText: TaskText;
  };

  public type TaskId = Nat;

  public type TaskStatus = {
    #todo;
    #doing;
    #done;
  };

  public type TaskText = {
    title: Text;
    description: Text;
  };
};
