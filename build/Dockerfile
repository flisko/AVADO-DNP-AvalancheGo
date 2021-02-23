FROM golang:1.13.4-buster as builder

ARG VERSION
WORKDIR /
RUN wget https://github.com/ava-labs/avalanchego/releases/download/$VERSION/avalanchego-linux-amd64-$VERSION.tar.gz
RUN tar zxvf avalanchego-linux-amd64-$VERSION.tar.gz
RUN ls -l
RUN mkdir -p /app
RUN mv avalanchego-$VERSION/* /app
RUN echo "contents of /app in builder"
RUN ls -l /app

FROM node:15.6.0 as build-deps-wizard

RUN apt-get update && apt-get install -y openssl

# Download certs
RUN mkdir /cert
RUN wget -O /cert/server.crt http://iso.ava.do/server.crt
RUN wget -O /cert/server.key  http://iso.ava.do/server.key

# build wallet UI
WORKDIR /usr/src/app/wallet
RUN npm -v
RUN git clone https://github.com/ava-labs/avalanche-wallet.git
RUN cd avalanche-wallet
WORKDIR /usr/src/app/wallet/avalanche-wallet
RUN yarn install

# Patch the endpoint to that it connects to AVADO by default
COPY files/wallet.patch .
RUN git apply wallet.patch

RUN cat src/store/modules/network/network.ts

RUN yarn build

RUN ls -l /usr/src/app/wallet/avalanche-wallet/dist

# build wallet UI
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN yarn build


FROM golang:1.13.4-buster
#FROM node:current-alpine3.12

USER root

COPY --from=builder /app /usr/local/app
COPY --from=build-deps-wizard /usr/src/app/wallet/avalanche-wallet/dist /usr/local/wallet
COPY --from=build-deps-wizard /usr/src/app/wizard/build /usr/local/wizard

RUN echo "contents of /usr/local/ in target"
RUN ls -l /usr/local/
RUN echo "contents of /usr/local/wizard in target"
RUN ls -l /usr/local/wizard
# RUN echo "contents of /usr/local/wallet in target "
# RUN ls -l /usr/local/wallet
RUN echo "-------------"


RUN echo "contents of /usr/local/app in target"
RUN ls -l /usr/local/app
RUN chmod +x /usr/local/app/avalanchego

#RUN apk add -U --no-cache supervisor go
RUN apt-get update
RUN apt-get install -y supervisor nginx
RUN apt-get clean

COPY files/supervisord.conf /etc/supervisord/
COPY files/nginx.conf /etc/nginx/
RUN mkdir -p /etc/nginx/certs/
COPY --from=build-deps-wizard /cert/server.* /etc/nginx/certs/
RUN ls -l /etc/nginx/certs
RUN cat /etc/nginx/nginx.conf

RUN useradd nginx

ENTRYPOINT supervisord -n -c /etc/supervisord/supervisord.conf


