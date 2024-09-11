#!/bin/bash

REPO="cr.yandex/crp53phlntopuut9qqq2"

function build_and_push {
    TAGS=("$REPO/shm-$1:latest")

    VERSION=$(git tag --points-at | head -n1)
    if [ "$VERSION" ]; then
        TAGS+=("$REPO/shm-$1:$VERSION")

        VERSION_MINOR=$(echo $VERSION | cut -d '.' -f 1,2)
        TAGS+=("$REPO/shm-$1:$VERSION_MINOR")
    fi

    docker build --platform linux/amd64,linux/arm64 \
        $(printf " -t %s" "${TAGS[@]}") \
        --target $1 .

    for TAG in ${TAGS[*]}; do
        docker push $TAG
    done
}

# Build Client
[ -z "$VERSION" ]; VERSION=$(git describe --abbrev=0 --tags)
echo -n "$VERSION-ee" > app/version
build_and_push client

