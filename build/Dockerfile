FROM --platform=linux/amd64 golang:1.22.2-bookworm as builder

ARG VERSION
WORKDIR /
RUN wget https://github.com/ava-labs/avalanchego/releases/download/$VERSION/avalanchego-linux-amd64-$VERSION.tar.gz
RUN tar zxvf avalanchego-linux-amd64-$VERSION.tar.gz
RUN mkdir -p /app
RUN mv avalanchego-$VERSION/* /app
FROM --platform=linux/amd64 node:18 as build-deps

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN npm i
RUN npm run build

# Build final image
FROM --platform=linux/amd64 golang:1.22.2-bookworm

USER root

# copy avalanche executable
COPY --from=builder /app /usr/local/app
RUN chmod +x /usr/local/app/avalanchego

COPY --from=build-deps /usr/src/app/wizard/build /usr/local/wizard

RUN apt-get update
RUN apt-get install -y supervisor nginx
RUN apt-get clean

COPY files/supervisord.conf /etc/supervisord/
COPY files/nginx.conf /etc/nginx/

# copy config files
COPY files/config /config 

RUN useradd nginx

ENTRYPOINT supervisord -n -c /etc/supervisord/supervisord.conf
