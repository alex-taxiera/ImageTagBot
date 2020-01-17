FROM node:12-alpine

RUN apk add --no-cache git; mkdir -p /tagger
WORKDIR /tagger

COPY . .
RUN npm install --only=prod

CMD ["npm", "start"]
