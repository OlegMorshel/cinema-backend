FROM node:16

WORKDIR /app

COPY package*.json ./
COPY src/prisma ./prisma

RUN yarn

COPY . .

RUN yarn migrate

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start:dev"]