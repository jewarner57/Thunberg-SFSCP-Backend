FROM node:lts-alpine

LABEL decription="Production image for THUNBERG backend."

WORKDIR /usr/src/thunberg/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
