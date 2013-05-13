#!/bin/bash

if [ ! -e scripts/autobuild.sh ] ; then
    echo "ERROR: !! Script must be run from the repo root directory !!"
    exit 1
fi

echo "-----------------------------"
echo "--- AUTOMATED TEST SCRIPT ---"
echo "-----------------------------"
echo ""

# Launch local-server
function localserver_launch {
    localserver_kill
    echo "Launching local server (output redirected to devserver.log) ..."
    runcmd local_server --init --launch --options "\-\-pid-file=devserver.pid" > devserver.log 2>&1 &

    echo "Waiting for local server to come up ..."
    # Check for a process listening on that port
    while ! (lsof -i -P | grep LISTEN | grep 8070)
    do
        echo " ...still waiting for local server ..."
        sleep 2
    done

    echo " local server is up."
}

function localserver_kill {
    echo "Looking for running local server ..."
    if [ -e 'devserver/devserver.pid' ] ; then
        _pid=`cat devserver/devserver.pid`
        echo "Killing local server (PID $_pid) ..."
        kill $_pid
        echo "Waiting for local server to shut down ..."
        wait $_pid 2>/dev/null
        rm -f devserver/devserver.pid
        echo " ... local server has shut down"
    else
        echo "None found"
    fi
}

# Things to do in an error condition
function exit_error {

    # Shutdown local server if running
    localserver_kill

}


# Exit on error or undefined variable
function runcmd {
    echo "[Executing: \"$@\"]"
    $@
    r=$?

    if [ "$r" != "0" ] ; then
        exit_error
        echo ""
        echo "===================================="
        echo "COMMAND FAILED: $@"
        echo "EXIT CODE: $r"
        echo "===================================="
        exit $r
    fi
}

# Basic setup
function setup {

  echo
  echo "-----------------------------"
  echo "  Sync/Update submodules"
  echo "-----------------------------"
  runcmd git submodule update --init

  echo
  echo "-----------------------------"
  echo "  Remove old build files"
  echo "-----------------------------"
  git clean -fdx build devserver

  echo
  echo "-----------------------------"
  echo "  Update python env modules"
  echo "-----------------------------"
  runcmd ./manage.py env

  echo
  echo "-----------------------------"
  echo "  Activate env"
  echo "-----------------------------"
  runcmd . env/bin/activate
}

# Docs
function docs {

  echo
  echo "-----------------------------"
  echo "  Building docs"
  echo "-----------------------------"
  runcmd ./manage.py check-docs
  runcmd ./manage.py check-docs-links

}

# Checks
function code_checks {

  echo
  echo "-----------------------------"
  echo "  Static Code Checks"
  echo "-----------------------------"
  runcmd ./manage.py check-ts
  runcmd ./manage.py check-py
}

# Build samples
function build_samples {

    echo
    echo "-----------------------------"
    echo "  Build tools"
    echo "-----------------------------"
    runcmd ./manage.py tools

    echo
    echo "-----------------------------"
    echo "  Cleaning samples"
    echo "-----------------------------"
    runcmd ./manage.py samples-clean
    git clean -fdx samples assets

    echo
    echo "-----------------------------"
    echo "  Build samples"
    echo "-----------------------------"
    runcmd ./manage.py samples
}

# Build other apps
function build_apps {

    echo
    echo "-----------------------------"
    echo "  Build tools"
    echo "-----------------------------"
    runcmd ./manage.py tools

    echo
    echo "-----------------------------"
    echo "  Cleaning apps"
    echo "-----------------------------"
    runcmd ./manage.py apps-clean
    git clean -fdx apps

    echo
    echo "-----------------------------"
    echo "  Build apps"
    echo "-----------------------------"
    runcmd ./manage.py apps
}

############################################################

function timestamp {
    echo "TIMESTAMP ------------ `date`"
}

while test -n "$1"; do
    case "$1" in
        --help|-h)
            echo "Usage:"
            echo "  $0 [<flags>] <checks|build|apps|samples|docs|localserver>"
            echo ""
            exit 1
            ;;
        *)
            if [ -n "$TARGET" ]; then
                echo "Multiple targets specified: $TARGET and $1"
                exit 1
            fi
            TARGET=$1
            ;;
    esac
    shift
done

case "$TARGET" in

    checks)
        timestamp
        setup

        timestamp
        code_checks

        timestamp
        ;;

    build)
        timestamp
        setup

        timestamp
        code_checks

        timestamp
        build_samples

        timestamp
        build_apps

        localserver_launch
        localserver_kill
        ;;

    apps)
        timestamp
        setup

        timestamp
        build_apps
        ;;

    samples)
        timestamp
        setup

        timestamp
        build_samples
        ;;

    docs)
        setup
        docs
        ;;

    localserver)
        timestamp
        setup

        localserver_launch
        localserver_kill
        ;;

    *)
        echo "Unknown target $TARGET:"
        echo "Supported targets <checks|build|apps|samples|docs|localserver>"
        exit 1
esac
