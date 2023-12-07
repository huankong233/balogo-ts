FROM huankong233/kkbot-ts

WORKDIR /balogo-ts

RUN apk update && apk upgrade
RUN apk add python3

ENTRYPOINT ["pnpm","run","docker"]
