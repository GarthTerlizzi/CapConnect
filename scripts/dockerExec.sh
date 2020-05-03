#!/bin/bash

target=$1
shift
run=`basename $1`

docker exec -t $target rm -rf /root/execin/
docker exec -t $target mkdir /root/execin/

for file in "$@"
do
    docker cp $file $target:/root/execin/
done

docker exec -w /root/execin/ -t $target bash ./$run

docker exec -t $target rm -rf /root/execin/
