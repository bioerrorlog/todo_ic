import T "Types";

module {
  public let emptyTaskOrders : T.TaskOrders = {
    // Is Array.init better?
    backlog = [];
    inProgress = [];
    review = [];
    done = [];
  };
};