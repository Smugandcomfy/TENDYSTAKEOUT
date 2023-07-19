#!/bin/bash

network=$1
mode=$2

copy_env() {
  chmod 777 ./scripts/env.sh
  ./scripts/env.sh $network
}

deploy_local() {
  echo "Deploying local..."

  copy_env

  yarn run i18n:extract
  yarn run i18n:compile

  dfx deploy --network=local --no-wallet --with-cycles=200000000000000000
}

deploy_ic() {
  echo "deploying ic..."

  yarn run i18n:extract
  yarn run i18n:compile

  copy_env

  dfx deploy --wallet="$(dfx identity --network=ic get-wallet)" --network=ic
}

if [ $network = "ic" ]
then
deploy_ic

else
deploy_local
fi
