#!ic-repl -r http://localhost:8000

load "prelude.sh";

// Initial state
call todo_ic.listProfiles();
assert _ == vec {};

// Fail to getMyProfile if profile does not exist
identity Alice;
call todo_ic.getMyProfile();
assert _ == variant { err = variant { notFound } };

// Fail to updateProfile if profile does not exist
call todo_ic.updateProfile(record {about="this is Alice updated"; name="Alice updated"});
assert _ == variant { err = variant { notFound } };

// createProfile by Alice
call todo_ic.createProfile(record {about="this is Alice"; name="Alice"});
assert _ == variant { ok };
call todo_ic.listProfiles();
assert _ ~= vec {record {about = "this is Alice"; name = "Alice";};};

// Fail to createProfile if profile already exists
call todo_ic.createProfile(record {about="this is Alice again"; name="Alice"});
assert _ == variant { err = variant { alreadyExists } };

// updateProfile by Alice
call todo_ic.updateProfile(record {about="this is Alice updated"; name="Alice updated"});
assert _ == variant { ok };
call todo_ic.listProfiles();
assert _ ~= vec {record {about = "this is Alice updated"; name = "Alice updated";};};

// createProfile by Bob
identity Bob;
call todo_ic.createProfile(record {about="this is Bob"; name="Bob"});
assert _ == variant { ok };
// TODO: fix record order issue
// call todo_ic.listProfiles();
// assert _ ~= vec {
//     record {about = "this is Alice updated"; name = "Alice updated"; };
//     record {about = "this is Bob"; name = "Bob"; };
// };
