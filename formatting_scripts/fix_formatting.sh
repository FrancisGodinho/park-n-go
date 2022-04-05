export CLANG_VERSION=10.0

CURR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SW_DIR="$CURR_DIR/../sw"

# Extensions to check formatting for clang-format
CLANG_FORMAT_EXTENSIONS=(h cpp c hpp)

# Function to run clang-format
function run_clang_format () {
    printf "Running clang-format over all files...\n\n"
    cd $BAZEL_ROOT_DIR

    # Generate extension string
    # Formatted as -iname *.EXTENSION -o
    EXTENSION_STRING=""
    for value in "${CLANG_FORMAT_EXTENSIONS[@]}"
    do
        EXTENSION_STRING="$EXTENSION_STRING -name *.$value -o"
    done

    # Find all the files that we want to format, and pass them to
    # clang-format as arguments
    # We remove the last -o flag from the extension string
    find $SW_DIR ${EXTENSION_STRING::-2}  \
        | xargs -I{} -n1000 $CURR_DIR/clang-format-$CLANG_VERSION -i -style=file

    if [[ "$?" != 0 ]]; then
        printf "\n***Failed to run clang-format over all files!***\n\n"
        exit 1
    fi
}

run_clang_format
exit 0