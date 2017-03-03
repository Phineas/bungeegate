FROM node:boron
MAINTAINER Phineas <phin@phineas.io>

RUN mkdir -p /usr/src/bgate
WORKDIR /usr/src/bgate

COPY package.json /usr/src/bgate
RUN npm install

COPY . /usr/src/bgate

EXPOSE 25565

CMD ["npm", "start"]
