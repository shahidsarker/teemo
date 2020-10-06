#!/bin/bash

# Check for a currently running instance of the agent
RUNNING_AGENT=`ps -ax | grep 'ssh-agent -s' | grep -v grep | wc -l | tr -d '[:space:]'`
if [ "$RUNNING_AGENT" = "0" ]
then
    # Launch a new instance of the agent and add existing keys
    eval $(ssh-agent -s)
    for key in $(ls ~/.ssh/*.pub)
    do
        # Removes .pub extension
        ssh-add ${key%.pub}
    done
fi
