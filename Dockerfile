FROM node:16 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY prisma prisma
RUN npx prisma generate

COPY config config
COPY src src
COPY ./tsconfig.json ./tsconfig.json
RUN npm run build


FROM node:16-alpine

WORKDIR /app
RUN export NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm run install:prod

COPY prisma prisma

COPY --from=build /app/dist /app


CMD ["npm", "run", "start:prod"]
