#!/bin/sh
if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi

echo Tickets downloading...
curl --location --request POST "https://eu-central-1.aws.data.mongodb-api.com/app/data-jukku/endpoint/data/v1/action/find" --header "Content-Type: application/json" --header "Access-Control-Request-Headers: *" --header "api-key: $MONGODB_API" --data-raw '{ "collection":"tickets", "database":"test", "dataSource":"Cluster0", "skip": 0, "limit": 50000 }' > tickets.json
echo Operations downloading...
curl --location --request POST "https://eu-central-1.aws.data.mongodb-api.com/app/data-jukku/endpoint/data/v1/action/find" --header "Content-Type: application/json" --header "Access-Control-Request-Headers: *" --header "api-key: $MONGODB_API" --data-raw '{ "collection":"operations", "database":"test", "dataSource":"Cluster0", "skip": 0, "limit": 50000}' > operations.json