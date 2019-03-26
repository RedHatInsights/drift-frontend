#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    .travis/release.sh "ci-beta"
    .travis/release.sh "ci-stable"
fi
