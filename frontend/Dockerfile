FROM node:16-alpine

WORKDIR /app

SHELL ["/bin/bash", "-c"]

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
