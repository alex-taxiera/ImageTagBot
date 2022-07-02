FROM node:lts-buster-slim AS base
RUN apt-get update && apt-get install libssl-dev ca-certificates -y

RUN mkdir -p /tagger
WORKDIR /tagger

COPY package.json package-lock.json ./

FROM base as build
RUN export NODE_ENV=production
RUN npm i

COPY . .
RUN npx prisma generate

FROM base as prod-build

RUN npm ci --no-optional --only=prod --ignore-scripts
COPY prisma prisma
RUN npx prisma generate
RUN cp -R node_modules prod_node_modules

FROM base as prod

COPY --from=prod-build /tagger/prod_node_modules /tagger/node_modules
COPY --from=build  /tagger/prisma /tagger/prisma

CMD ["npm", "start"]
