#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    .travis/release.sh "ci-beta"
    cd dist
    git fetch origin ci-stable
    git push origin ci-beta:ci-stable
fi

if [[ "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi

if [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
