#!/bin/bash
network=${1:-"local"}

chmod 777 ./scripts/env.sh
./scripts/env.sh $network

local_ids_json="{}"

if [ $network = "local" ]
then

  if [ ! -f "src/constants/canister_ids_local.json" ];then
    printf $local_ids_json > src/constants/canister_ids_local.json
  fi
fi

# locales
yarn i18n:extract

yarn start
