#!/bin/bash
BUILDS="builds"
BUILD_SCRIPT="build.sh"
MANIFEST="manifest.json"
MANIFEST_FIREFOX="manifest-firefox.json"
MANIFEST_CHROME="manifest-chrome.json"

get_version() {
    echo | cat $MANIFEST | \
    python3 -c "import json,sys; print(json.load(sys.stdin)['version']);"
}

if [ -f $MANIFEST ] && \
   [ -f $MANIFEST_CHROME ] && \
   [ ! -f $MANIFEST_FIREFOX ]
then
    if [ ! -d $BUILDS ]
    then
        mkdir $BUILDS
    fi
    # Build Firefox version.
    FIREFOX_VERSION=$(get_version)
    zip -r -FS $BUILDS/find-it-mozila-$FIREFOX_VERSION.zip * \
        -x "*.git*" \
        -x "README.md" \
        -x $BUILDS/\* \
        -x $BUILD_SCRIPT \
        -x $MANIFEST_CHROME
    # Prepare Chrome manifest.
    mv $MANIFEST $MANIFEST_FIREFOX
    mv $MANIFEST_CHROME $MANIFEST
    # Build Chrome version.
    CHROME_VERSION=$(get_version)
    zip -r -FS $BUILDS/find-it-chrome-$CHROME_VERSION.zip * \
        -x "*.git*" \
        -x "README.md" \
        -x $BUILDS/\* \
        -x $BUILD_SCRIPT \
        -x $MANIFEST_FIREFOX
    # Revert manifest renaming.
    mv $MANIFEST $MANIFEST_CHROME
    mv $MANIFEST_FIREFOX $MANIFEST
    echo "Done"
else
    echo "Something is wrong"
fi
