#!/bin/sh

VERSION=$1

if [ -z $VERSION ] ; then
    echo "Usage: ic-repl-install.sh <version>" >&2
    exit 1
fi

BINDIR=$HOME/bin
mkdir -p $BINDIR
IC_BIN=$BINDIR/ic-repl

wget --output-document $IC_BIN https://github.com/chenyan2002/ic-repl/releases/download/$VERSION/ic-repl-linux64 \
    && chmod +x $IC_BIN \
    && $IC_BIN --help
