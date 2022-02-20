BACKEND_CANISTER=todo_ic
FRONTEND_CANISTER=$(BACKEND_CANISTER)_assets 

WASM_OUTDIR=_wasm_out

BACKEND_DIR=src/$(BACKEND_CANISTER)

BACKEND_MODULE_TEST_DIR=$(BACKEND_DIR)/tests/module
BACKEND_CANISTER_TEST_DIR=$(BACKEND_DIR)/tests/canister

EX_ID=$(shell dfx identity whoami)

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

.PHONY: type_check
type_check:
	for i in src/$(BACKEND_CANISTER)/**/*.mo ; do \
		echo "==== Run type check $$i ===="; \
		$(shell dfx cache show)/moc $(shell vessel sources) --check $$i || exit; \
	done
	echo "SUCCEED: All motoko type check passed"

.PHONY: module_test
module_test:
	rm -rf $(WASM_OUTDIR)
	mkdir $(WASM_OUTDIR)

	for i in $(BACKEND_MODULE_TEST_DIR)/*Test.mo; do \
		echo "==== Run module test $$i ===="; \
		$(shell dfx cache show)/moc $(shell vessel sources) -wasi-system-api -o $(WASM_OUTDIR)/$(shell basename $$i .mo).wasm $$i || exit; \
		wasmtime $(WASM_OUTDIR)/$(shell basename $$i .mo).wasm || exit; \
	done
	rm -rf $(WASM_OUTDIR)
	echo "SUCCEED: All module tests passed"

.PHONY: canister_test
canister_test:
	for f in $(BACKEND_CANISTER_TEST_DIR)/*.test.sh; do \
		echo "==== Run canister test $$f ===="; \
		ic-repl -r http://localhost:8000 "$$f" || exit; \
	done

	# Anonymous identity call test
	# because ic-repl can't switch to anonymous identity.
	dfx identity use anonymous

	dfx canister call $(BACKEND_CANISTER) createProfile '(record {about="this is anonymous user"; name="anonimous_0"})' \
		| grep '(variant { err = variant { notAuthorized } })' && echo 'PASS'
	dfx canister call $(BACKEND_CANISTER) updateProfile '(record {about="this is updated anonymous user"; name="anonimous_1"})' \
		| grep '(variant { err = variant { notAuthorized } })' && echo 'PASS'
	dfx canister call $(BACKEND_CANISTER) createTask '(record {title="Anonymous task title 001" ; description="This is anonymous 1."})' \
		| grep '(variant { err = variant { notAuthorized } })' && echo 'PASS'

	# Can call as anonymous identity
	dfx canister call $(BACKEND_CANISTER) listProfiles || exit
	dfx canister call $(BACKEND_CANISTER) listAllTasks || exit
	dfx canister call $(BACKEND_CANISTER) getGlobalTaskOrders || exit

	dfx identity use $(EX_ID)
	echo "SUCCEED: All canister tests passed"

.PHONY: all_test
all_test: type_check module_test canister_test

.PHONY: clean
clean:
	rm -fr .dfx
