FROM golang:1.13.4-buster as builder

ARG VERSION
WORKDIR /
RUN wget https://github.com/ava-labs/avalanchego/releases/download/$VERSION/avalanchego-linux-$VERSION.tar.gz
RUN tar zxvf avalanchego-linux-$VERSION.tar.gz
RUN ls -l
RUN mkdir -p /app
RUN mv avalanchego-$VERSION/* /app
RUN echo "contents of /app in builder"
RUN ls -l /app

FROM node:12.14.1 as build-deps-wizard

WORKDIR /usr/src/app/wallet
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


FROM golang:1.13.4-buster
#FROM node:current-alpine3.12

USER root

COPY --from=builder /app /usr/local/app
COPY --from=build-deps-wizard /usr/src/app/wallet/avalanche-wallet/dist /usr/local/wallet

RUN echo "contents of /usr/local/app in target"
RUN ls -l /usr/local/app
RUN chmod +x /usr/local/app/avalanchego

RUN echo "contents of /usr/local/wallet in target"
RUN ls -l /usr/local/wallet


#RUN apk add -U --no-cache supervisor go
RUN apt-get update
RUN apt-get install -y supervisor nginx
RUN apt-get clean

COPY files/supervisord.conf /etc/supervisord/
COPY files/nginx.conf /etc/nginx/

RUN useradd nginx

ENTRYPOINT supervisord -n -c /etc/supervisord/supervisord.conf



    

