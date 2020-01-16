#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    echo
    echo
    echo "PUSHING ci-beta"
    .travis/release.sh "ci-beta"

    echo "Rebuilding for stable branches"
    rm -rf dist/
    BUILD_STABLE=true npm run travis:build
    echo
    echo
    echo "PUSHING ci-stable"
    .travis/release.sh "ci-stable"
fi

if [ "${TRAVIS_BRANCH}" = "qa" ]; then
    echo "Building for qa-stable"
    echo
    echo
    echo "PUSHING qa-stable"
    .travis/release.sh "qa-stable"

    echo "Rebuilding for qa-beta"
    rm -rf dist/
    BUILD_BETA=true npm run travis:build
    echo
    echo
    echo "PUSHING qa-beta"
    .travis/release.sh "qa-beta"
fi

if [ "${TRAVIS_BRANCH}" = "prod" ]; then
    echo "Building for prod-stable"
    echo
    echo
    echo "PUSHING prod-stable"
    .travis/release.sh "prod-stable"

    echo "Rebuilding for prod-beta"
    rm -rf dist/
    BUILD_BETA=true npm run travis:build
    echo
    echo
    echo "PUSHING prod-beta"
    .travis/release.sh "prod-beta"
fi
