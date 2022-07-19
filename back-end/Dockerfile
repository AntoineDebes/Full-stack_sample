FROM node:current-alpine3.15

WORKDIR "/app"

COPY package.json .
RUN yarn 
COPY . .

CMD ["yarn","dev"]