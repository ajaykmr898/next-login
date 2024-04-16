#!/bin/sh
TODAY=$(date +%F_%H-%M-%S)
mkdir -p managerBackups
cd managerBackups
URL=https://eu-central-1.aws.data.mongodb-api.com/app/data-jukku/endpoint/data/v1/action/find
KEY=6VkCQ3SME9i0JakxSY05IoCkQmC10mwxPpZAZXSdGLLD23VURjjYlChfy9s6g3os
TYPE=application/json
COLLECTIONS=("tickets" "operations" "users" "agentsoperations" "expenses")
for collection in "${COLLECTIONS[@]}"; do
  echo "$collection downloading..."
  curl --location --request POST "$URL" \
    --header "Content-Type: $TYPE" \
    --header "Access-Control-Request-Headers: *" \
    --header "api-key: $KEY" \
    --data-raw "{ \"collection\": \"$collection\", \"database\": \"test\", \"dataSource\": \"Cluster0\", \"skip\": 0, \"limit\": 50000 }" \
     > "$collection"_"$TODAY.json"
done