FROM node:18.19.0-bullseye-slim

WORKDIR /balogo-ts

COPY . /balogo-ts

RUN apt update && apt upgrade
RUN apt install python3 -y
RUN npm install pnpm -g
RUN cd /balogo-ts
RUN pnpm install

ENTRYPOINT ["pnpm","run","docker"]