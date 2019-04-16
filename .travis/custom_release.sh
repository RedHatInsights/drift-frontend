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

if [[ "${TRAVIS_BRANCH}" = "qa" ]]; then
    echo
    echo
    echo "PUSHING qa-beta"
    .travis/release.sh "qa-beta"
    rm -rf dist/.git

    echo
    echo
    echo "PUSHING qa-stable"
    .travis/release.sh "qa-stable"
fi

if [[ "${TRAVIS_BRANCH}" = "prod" ]]; then
    echo
    echo
    echo "PUSHING prod-beta"
    .travis/release.sh "prod-beta"
    rm -rf dist/.git

    echo
    echo
    echo "PUSHING prod-stable"
    .travis/release.sh "prod-stable"
fi
