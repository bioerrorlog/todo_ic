BACKEND_CANISTER=todo_ic
FRONTEND_CANISTER=$(BACKEND_CANISTER)_assets 

WASM_OUTDIR=_wasm_out

BACKEND_DIR=src/$(BACKEND_CANISTER)

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
	echo yes | dfx canister install $(BACKEND_CANISTER) --mode reinstall
	echo yes | dfx canister install $(FRONTEND_CANISTER)--mode reinstall

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
	# TODO: assert

	dfx canister call $(BACKEND_CANISTER) listProfiles \
		| grep '(variant { "empty" })' && echo 'PASS'
	dfx canister call $(BACKEND_CANISTER) createProfile '(record {about="this is test user"; name="BioErrorLog_0"})' \
		| grep '(variant { ok })' && echo 'PASS'
	dfx canister call $(BACKEND_CANISTER) listProfiles
	dfx canister call $(BACKEND_CANISTER) updateProfile '(record {about="this is updated test user"; name="BioErrorLog_1"})' \
		| grep '(variant { ok })' && echo 'PASS'
	dfx canister call $(BACKEND_CANISTER) listProfiles
	dfx canister call $(BACKEND_CANISTER) putTask '(record {id="0000001"; title="Task title 001" ; description="This is description." ; status=variant {todo}})' \
		| grep '(variant { ok = "0000001" })' && echo 'PASS'
	dfx canister call $(BACKEND_CANISTER) listMyTasks
	dfx canister call $(BACKEND_CANISTER) listTasksByUserId "(principal \"$(shell dfx identity get-principal)\")"

.PHONY: all_test
all_test: module_test canister_test

.PHONY: clean
clean:
	rm -fr .dfx
