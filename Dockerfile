FROM node:12-alpine

RUN apk add --no-cache git; mkdir -p /tagger
WORKDIR /tagger

COPY . .
RUN npm ci --only=prod --no-optional

CMD ["npm", "start"]
