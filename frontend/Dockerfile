FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 30000

CMD ["npm","run","dev","--","--host","0.0.0.0","--port","30000"]
