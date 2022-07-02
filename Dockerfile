FROM node:16-alpine

RUN mkdir -p /tagger
WORKDIR /tagger

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

CMD ["npm", "start"]
