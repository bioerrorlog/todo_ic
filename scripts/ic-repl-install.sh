#!/bin/sh

BINDIR=$HOME/bin
mkdir -p $BINDIR
IC_BIN=$BINDIR/ic-repl
VERSION=2021-05-19

wget --output-document $IC_BIN https://github.com/chenyan2002/ic-repl/releases/download/$VERSION/ic-repl-linux64 \
    && chmod +x $IC_BIN \
    && $IC_BIN --help
