FROM node:18.19.0-bullseye-slim

WORKDIR /balogo-ts

COPY . /balogo-ts

RUN npm install pnpm -g

ENTRYPOINT ["pnpm","run","docker"]