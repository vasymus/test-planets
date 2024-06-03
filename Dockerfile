# build client and generate frontend
FROM node:14.3

WORKDIR opt/node_app/app

COPY client/package*.json client/
RUN npm install --only-production --prefix client

COPY server/package*.json server/
RUN npm install --only-production --prefix server

ENV INLINE_RUNTIME_CHUNK=false
COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD ["npm", "start", "--prefix", "server"]
