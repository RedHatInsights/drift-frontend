#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    .travis/release.sh "ci-beta"
    rm -rf .git
    .travis/release.sh "ci-stable"
fi

if [[ "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
