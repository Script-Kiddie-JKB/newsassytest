FROM node:18

COPY package*.json ./

WORKDIR /opt/server/backend-test

COPY . .

RUN npm install
EXPOSE 8080
