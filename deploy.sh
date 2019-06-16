#!/bin/bash

# function to display commands
exe() { echo "\$ $@" ; "$@"; }
remote() { exe ssh ${targetUser}@${targetHost} ${@}; }

# load variables from .env file
export $(cat .env | xargs)

# local configuration
localPath=${DEPLOY_FROM}

# project configuration
projectName=${NAME}

# target configuration
targetUser=${DEPLOY_USER}
targetHost=${DEPLOY_HOST}
targetPath=${DEPLOY_PATH}


# ask if you want to deploy
read -p 'Do you wish to deploy this project to production (y/n)? ' answer
case ${answer:0:1} in
    y|Y )
        echo Yes;
    ;;
    * )
        echo Stopping...;
        exit;
    ;;
esac


# process deploy
echo "Deploying project ${projectName} to the ${targetHost} with user ${targetUser}..."

echo "\nBuilding the app..."
exe npm run build

echo "\nSyncing project folder without files under gitignore..."
exe rsync -az --filter=":- .gitignore" ${localPath}/ ${targetUser}@${targetHost}:${targetPath}

echo "\nComplete!"
