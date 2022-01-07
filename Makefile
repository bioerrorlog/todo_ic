WASM_OUTDIR=_wasm_out

BACKEND_DIR=src/todo_ic

BACKEND_TEST_DIR=$(BACKEND_DIR)/tests

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
	rm -rf $(WASM_OUTDIR)
	mkdir $(WASM_OUTDIR)
	for i in $(BACKEND_TEST_DIR)/*mo; do \
		$(shell vessel bin)/moc $(shell vessel sources) -wasi-system-api -o $(WASM_OUTDIR)/$(shell basename $$i .mo).wasm $$i; \
		wasmtime $(WASM_OUTDIR)/$(shell basename $$i .mo).wasm; \
	done
	rm -rf $(WASM_OUTDIR)

.PHONY: canister_test
canister_test:
	# TODO: use ic-repl

	# addTask
	dfx canister call todo_ic addTask '(record { title="Task 001"; description="Write test code"; })'
	# getTasks
	dfx canister call todo_ic getTasks \
		| grep 'taskText = record { title = "Task 001"; description = "Write test code" };' && echo 'PASS'

.PHONY: all_test
all_test: module_test canister_test

.PHONY: clean
clean:
	rm -fr .dfx
