FROM node:16-alpine AS builder

RUN apk add python3 make
COPY . /usr/src/app
ENV NODE_ENV="production"
RUN cd /usr/src/app && npm install --production

FROM node:16-alpine AS final

COPY --from=builder /usr/src/app /app
ENV NODE_ENV="production"
VOLUME /data
WORKDIR /app

EXPOSE 3000
USER node:node
CMD ["node", "index.js"]