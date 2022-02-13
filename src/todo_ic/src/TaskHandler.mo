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
};
