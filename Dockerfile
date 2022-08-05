FROM node:16-alpine AS builder

ENV NODE_ENV=development

RUN apk add curl bash --no-cache

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# install ALL dependencies
RUN yarn --frozen-lockfile --ignore-optional

# Copy application
COPY . .

# build application
RUN yarn build

# remove development dependencies
RUN npm prune --production

# Build development purposes image
FROM builder AS dev

# Start application in development mode
CMD [ "npm", "run", "start:dev" ]

## Build production-ready image
FROM node:16-alpine AS prod

ENV NODE_ENV=production

RUN apk add dumb-init --no-cache

RUN mkdir -p /usr/src/app && chown node:node /usr/src/app
WORKDIR /usr/src/app

# copy artifacts
COPY --chown=node:node . ./
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist/
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "npm", "run", "start:prod" ]
