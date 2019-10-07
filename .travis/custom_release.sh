#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    echo
    echo
    echo "PUSHING ci-beta"
    .travis/release.sh "ci-beta"
    rm -rf dist/.git
    .travis/release.sh "qa-beta"

    echo "Rebuilding for stable branches"
    rm -rf dist/
    BUILD_STABLE=true npm run travis:build
    echo
    echo
    echo "PUSHING ci-stable"
    .travis/release.sh "ci-stable"
    rm -rf dist/.git
    .travis/release.sh "qa-stable"
fi

if [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
