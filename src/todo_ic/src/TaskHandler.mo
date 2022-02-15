import Array "mo:base/Array";
import Principal "mo:base/Principal";

import Constants "Constants";
import T "Types";
import UH "Utils/HashMap";

module {

  // If userId (Principal) linked TaskOrders exists in userTaskOrders, return it.
  // If not exited, return empty TaskOrders.
  public func getTaskOrdersByUserId(
    userTaskOrders : T.UserTaskOrders,
    userId : Principal
  ) : T.TaskOrders {
    UH.getWithInitVal(userTaskOrders, userId, Constants.emptyTaskOrders)
  };

  // Append new TaskId to the end of backlog
  public func appendTaskOrders(
    oldTaskOrders : T.TaskOrders,
    newTaskId : T.TaskId
  ) : T.TaskOrders {
    let newTaskOrders : T.TaskOrders = {
      backlog = Array.append<T.TaskId>(oldTaskOrders.backlog, [newTaskId]); // TODO: Array.append is deprecated
      inProgress = oldTaskOrders.inProgress;
      review = oldTaskOrders.review;
      done = oldTaskOrders.done;
    };

    newTaskOrders
  };
};
