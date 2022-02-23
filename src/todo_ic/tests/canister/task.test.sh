#!ic-repl -r http://localhost:8000

load "prelude.sh";

// Initial state
call todo_ic.listAllTasks();
assert _ == vec {};
call todo_ic.getGlobalTaskOrders();
assert _ == record { review = vec {}; done = vec {}; inProgress = vec {}; backlog = vec {}; };

// Fail to createTask before createProfile
identity Alice;
call todo_ic.createTask(record {title="Task title Alice 0" ; description="This is description Alice 0."});
assert _ == variant { err = variant { profileDoesNotExists } };

// createTask by Alice
call todo_ic.createProfile(record {about="this is Alice"; name="Alice"});
assert _ == variant { ok };
call todo_ic.createTask(record {title="Task title Alice 1" ; description="This is description Alice 1."});
assert _ == variant { ok = "1" };
call todo_ic.createTask(record {title="Task title Alice 2" ; description="This is description Alice 2."});
assert _ == variant { ok = "2" };

// getMyTaskOrders by Alice
call todo_ic.getMyTaskOrders();
assert _ == record {
    review = vec {};
    done = vec {};
    inProgress = vec {};
    backlog = vec { "1"; "2" };
};

// createTask by Bob
identity Bob;
call todo_ic.createProfile(record {about="this is Bob"; name="Bob"});
assert _ == variant { ok };
call todo_ic.createTask(record {title="Task title Bob 1" ; description="This is description Bob 1."});
assert _ == variant { ok = "3" };
call todo_ic.createTask(record {title="Task title Bob 2" ; description="This is description Bob 2."});
assert _ == variant { ok = "4" };

// getMyTaskOrders by Bob
identity Bob;
call todo_ic.getMyTaskOrders();
assert _ == record {
    review = vec {};
    done = vec {};
    inProgress = vec {};
    backlog = vec { "3"; "4" };
};

// getGlobalTaskOrders
call todo_ic.getGlobalTaskOrders();
assert _ == record {
    review = vec {};
    done = vec {};
    inProgress = vec {};
    backlog = vec { "1"; "2"; "3"; "4" };
};

// listAllTasks
call todo_ic.listAllTasks();
assert _ == vec {
    record {
        id = "3";
        status = variant { backlog };
        title = "Task title Bob 1";
        description = "This is description Bob 1.";
    };
    record {
        id = "4";
        status = variant { backlog };
        title = "Task title Bob 2";
        description = "This is description Bob 2.";
    };
    record {
        id = "1";
        status = variant { backlog };
        title = "Task title Alice 1";
        description = "This is description Alice 1.";
    };
    record {
        id = "2";
        status = variant { backlog };
        title = "Task title Alice 2";
        description = "This is description Alice 2.";
    };
};
