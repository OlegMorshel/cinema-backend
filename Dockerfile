FROM node:16

WORKDIR /app

COPY package*.json ./
COPY src/prisma ./prisma

RUN npm install

COPY . .

RUN npm run migrate

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:dev"]