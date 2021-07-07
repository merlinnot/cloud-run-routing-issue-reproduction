FROM node:16-alpine

WORKDIR /run

COPY ./package*.json ./
COPY ./index.js ./index.js

CMD [ "node", "/run/index.js"]
