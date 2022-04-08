# REQUIRES: 
# sudo apt install clang-format
# sudo apt install libncurses5

export CLANG_VERSION=10.0

CURR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SW_DIR="$CURR_DIR/../sw"

CLANG_FORMAT_EXTENSIONS=(h cpp c hpp)

function run_clang_format () {
    printf "Running clang-format over all files...\n\n"

    EXTENSION_STRING=""
    for value in "${CLANG_FORMAT_EXTENSIONS[@]}"
    do
        EXTENSION_STRING="$EXTENSION_STRING -name *.$value -o"
    done

    find $SW_DIR ${EXTENSION_STRING::-2}  \
        | xargs -I{} -n1000 $CURR_DIR/clang-format-$CLANG_VERSION -i -style=file

    if [[ "$?" != 0 ]]; then
        printf "\n***Failed to run clang-format over all files!***\n\n"
        exit 1
    fi
}

run_clang_format
exit 0
