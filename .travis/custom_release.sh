#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    echo
    echo
    echo "PUSHING ci-beta"
    .travis/release.sh "ci-beta"
    rm -rf dist/.git

    echo
    echo
    echo "PUSHING ci-stable"
    .travis/release.sh "ci-stable"
fi

if [[ "${TRAVIS_BRANCH}" = "ci-stable"  || "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" || "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
