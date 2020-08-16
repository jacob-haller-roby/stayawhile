FROM node:12.18.0

WORKDIR /

COPY package.json ./
RUN npm install
COPY ./dist/ ./dist/

CMD [ "node", "/dist/server.js" ]
