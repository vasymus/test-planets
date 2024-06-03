# build client and generate frontend
FROM node:14.3 as client

WORKDIR opt/node_app/app

COPY client/package*.json client/
RUN npm install --only-production --prefix client

ENV INLINE_RUNTIME_CHUNK=false
COPY client/ client/
# build to folder /opt/node_app/server/public
RUN npm run build --prefix client

FROM node:20.12.2 as server

WORKDIR opt/node_app/app

# copy build from previous step to server folder
COPY --from=client /opt/node_app/app/server /opt/node_app/app/server

COPY server/package*.json server/
RUN npm install --only-production --prefix server

COPY server/ server/

USER node

CMD ["npm", "start", "--prefix", "server"]
