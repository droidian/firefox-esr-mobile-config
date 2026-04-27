#!/bin/sh -e
# Description: create documentation with sphinx
# Options: native
# https://postmarketos.org/pmb-ci

# Install required packages in CI
if [ "$(id -u)" = 0 ]; then
	set -x
	apk -q add \
		git \
		make \
		py3-pip
	exec su "${TESTUSER:-build}" -c "sh -e $0"
fi

make -C docs
