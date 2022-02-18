#!ic-repl -r http://localhost:8000

load "prelude.sh";

// Initial state
call todo_ic.listProfiles();
assert _ == vec {};

// createProfile by Alice
identity Alice;
call todo_ic.createProfile(record {about="this is Alice"; name="Alice"});
assert _ == variant { ok };
call todo_ic.listProfiles();
assert _ ~= vec {record {about = "this is Alice"; name = "Alice";};};

// Fail with alreadyExists: createProfile by Alice
identity Alice;
call todo_ic.createProfile(record {about="this is Alice again"; name="Alice"});
assert _ == variant { err = variant { alreadyExists } };

// createProfile by Bob
identity Bob;
call todo_ic.createProfile(record {about="this is Bob"; name="Bob"});
assert _ == variant { ok };
// TODO: fix record order issue
// call todo_ic.listProfiles();
// assert _ ~= vec {
//     record {about = "this is Alice"; name = "Alice"; };
//     record {about = "this is Bob"; name = "Bob"; };
// };
