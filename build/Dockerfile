FROM --platform=linux/amd64 golang:1.22.2-bookworm as builder

ARG VERSION
WORKDIR /
RUN wget https://github.com/ava-labs/avalanchego/releases/download/$VERSION/avalanchego-linux-amd64-$VERSION.tar.gz
RUN tar zxvf avalanchego-linux-amd64-$VERSION.tar.gz
#RUN ls -l
RUN mkdir -p /app
RUN mv avalanchego-$VERSION/* /app
RUN echo "contents of /app in builder"
#RUN ls -l /app

# FROM --platform=linux/amd64 node:16-buster as build-deps-wallet

# RUN apt-get update && apt-get install -y openssl

# # Download initial SSL certs
# RUN mkdir -p /etc/nginx/certs/
# RUN wget -O /etc/nginx/certs/my.ava.do.crt http://iso.ava.do/my.ava.do.crt
# RUN wget -O /etc/nginx/certs/my.ava.do.key  http://iso.ava.do/my.ava.do.key

# # build wallet UI
# WORKDIR /usr/src/app/wallet
# RUN npm -v
# RUN git clone https://github.com/ava-labs/avalanche-wallet.git
# RUN cd avalanche-wallet
# WORKDIR /usr/src/app/wallet/avalanche-wallet
# RUN yarn install

# # Patch the endpoint to that it connects to AVADO by default
# COPY files/wallet.patch .
# RUN git apply wallet.patch

# RUN cat src/store/modules/network/network.ts

# RUN yarn build

FROM --platform=linux/amd64 node:18 as build-deps

# RUN apt-get update && apt-get install -y openssl

# Download initial SSL certs
RUN mkdir -p /etc/nginx/certs/
RUN wget -O /etc/nginx/certs/my.ava.do.crt http://iso.ava.do/my.ava.do.crt
RUN wget -O /etc/nginx/certs/my.ava.do.key  http://iso.ava.do/my.ava.do.key

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN npm i
RUN npm run build

# Build final image
FROM --platform=linux/amd64 golang:1.22.2-bookworm

USER root

COPY --from=builder /app /usr/local/app
# COPY --from=build-deps-wallet /usr/src/app/wallet/avalanche-wallet/dist /usr/local/wallet
COPY --from=build-deps /usr/src/app/wizard/build /usr/local/wizard

RUN chmod +x /usr/local/app/avalanchego

RUN apt-get update
RUN apt-get install -y supervisor nginx
RUN apt-get clean

COPY files/supervisord.conf /etc/supervisord/
COPY files/dlcerts.sh /bin/dlcerts
RUN chmod +x /bin/dlcerts
COPY files/nginx.conf /etc/nginx/
RUN mkdir -p /etc/nginx/certs/
COPY --from=build-deps /etc/nginx/certs/* /etc/nginx/certs/

# copy config files
COPY files/config /config 

RUN useradd nginx

ENTRYPOINT supervisord -n -c /etc/supervisord/supervisord.conf
