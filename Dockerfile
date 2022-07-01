FROM node:16-alpine

RUN mkdir -p /tagger
WORKDIR /tagger

COPY package.json package-lock.json ./
RUN npm ci --no-optional --only=prod --ignore-scripts
COPY . .

CMD ["npm", "start"]
