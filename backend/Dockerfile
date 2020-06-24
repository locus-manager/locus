FROM node:12

# Create app directory
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install
RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]
