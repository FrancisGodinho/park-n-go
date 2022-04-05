CURR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$CURR_DIR/formatting_scripts/fix_formatting.sh
if [[ "$?" != 0 ]]; then
    echo "FAILED, there is an error formatting files. Stopping script."
    exit 1
fi

GIT_CHANGES=$(git status --porcelain)
if [[ $GIT_CHANGES ]]; then
    echo "FILES CHANGED:"
    echo "$GIT_CHANGES"
    echo "-------------------------------------------------------------------------"
    echo "Formatting check failed - reformat code with \`fix_formatting.sh\` script and recommit"
    exit 1
else
    echo "formatting passed, no files changed :D"
    exit 0
fi