# Init

## Local dev

Used different version of node because of client dependency error 

```shell
docker-compose up -d

# build client if not built before
docker-compose exec client bash
# npm install and run build in 'client' folder
npm install --prefix client
npm run build --prefix client
exit

# run server
docker-compose exec server bash
# npm install and run|watch node server in 'server' folder
npm install --prefix server
npm run start --prefix server
# or watch
npm run watch --prefix server
```

## Build image

```shell
# authenticate to docker hub
docker login

docker image build --file ./Dockerfile --tag vasymus/node-planets:$MY_TAG_HERE .

# push docker image to repository
docker image push vasymus/node-planets:$MY_TAG_HERE
```
