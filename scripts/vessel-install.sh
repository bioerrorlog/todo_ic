#!/bin/sh

BINDIR=$HOME/bin
mkdir -p $BINDIR
BIN=$BINDIR/vessel
OS_FILENAME=linux64
VESSEL_VERSION=v0.6.0

wget --output-document $BIN https://github.com/dfinity/vessel/releases/download/$VESSEL_VERSION/vessel-$OS_FILENAME \
    && chmod +x $BIN \
    && $BIN help
