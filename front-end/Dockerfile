FROM node:current-alpine3.15

# RUN apk update && apk add autoconf
WORKDIR "/app"

COPY ./package.json .
RUN npm install

COPY . .

CMD ["npm","run","develop"]
