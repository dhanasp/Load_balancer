FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm i -g nodemon \
    && npm install

# this will cache packages only install when

COPY . .

CMD [ "npm", "start" ]




