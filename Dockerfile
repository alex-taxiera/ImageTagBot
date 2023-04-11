FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY prisma prisma
RUN npx prisma generate

COPY src src
COPY ./tsconfig.json ./tsconfig.json
RUN npm run build


FROM node:16-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm run install:prod

COPY --from=build /app/dist/src ./
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY config/production.cjs config/production.cjs


CMD ["npm", "run", "start:prod"]
