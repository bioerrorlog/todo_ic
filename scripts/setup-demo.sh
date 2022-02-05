#!/bin/sh

BACKEND_CANISTER=todo_ic

dfx canister call ${BACKEND_CANISTER} initialize

dfx canister call ${BACKEND_CANISTER} createProfile '(record {about="this is test user"; name="BioErrorLog_0"})'

dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Build a quick prototype" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Setup the backend test environment" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Write the Motoko modules test codes" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Write the backend canister test codes" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Setup the frontend test environment" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Write tests with Jest" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Write tests with react-testing-library" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Search for cypress" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} createTask '(record {title="Write e2e tests" ; description="Description Here."})'
dfx canister call ${BACKEND_CANISTER} fetchAllTasks