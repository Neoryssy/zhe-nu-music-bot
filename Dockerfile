FROM node:18.16.0

WORKDIR /app
COPY package*.json /app
# RUN npm ci --omit=dev && npm install typescript -g

RUN npm ci
RUN npm i typescript -g

COPY . .

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]
