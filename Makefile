.PHONY: all
all: build

.PHONY: build
build:
	dfx canister create --all
	dfx build

.PHONY: install
install: build
	dfx canister install --all

.PHONY: upgrade
upgrade: build
	dfx canister install --all --mode upgrade

.PHONY: reinstall
reinstall: build
	# The --mode=reinstall is only valid when specifying a single canister
	echo yes | dfx canister install todo_ic --mode reinstall
	echo yes | dfx canister install todo_ic_assets --mode reinstall

.PHONY: module_test
module_test:
	# TODO: extend "src/todo_ic/tests/Test.mo" to "src/todo_ic/tests/*.mo"
	$(shell vessel bin)/moc $(shell vessel sources) -wasi-system-api -o Test.wasm src/todo_ic/tests/Test.mo && wasmtime Test.wasm
	rm -f Test.wasm

.PHONY: canister_test
canister_test: reinstall
	# TODO: use ic-repl

	# Add Task
	dfx canister call todo_ic addTask "Task 001: Write test code"
	dfx canister call todo_ic addTask "Task 002: Run test"
	dfx canister call todo_ic addTask "Task 003: Taste the red bar"
	# Get tasks
	dfx canister call todo_ic getTasks \
		| grep "Task 001: Write test code" && echo 'PASS'
	dfx canister call todo_ic getTasks \
		| grep "Task 002: Run test" && echo 'PASS'
	dfx canister call todo_ic getTasks \
		| grep "Task 003: Taste the red bar" && echo 'PASS'

.PHONY: all_test
all_test: module_test canister_test

.PHONY: clean
clean:
	rm -fr .dfx
