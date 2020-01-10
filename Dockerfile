
FROM node:erbium

RUN apt-get update && apt-get install -y

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production
COPY . /usr/src/app
CMD [ "npm", "start" ]
