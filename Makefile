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
	dfx canister install todo_ic --mode reinstall

.PHONY: test
test:
	# Add Task
	dfx canister call todo_ic addTask "Task 001: Write test code"
	dfx canister call todo_ic addTask "Task 002: Run test"
	dfx canister call todo_ic addTask "Task 003: Taste the red bar"

.PHONY: clean
clean:
	rm -fr .dfx
