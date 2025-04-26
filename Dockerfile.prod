FROM node:23.9.0-alpine
WORKDIR /usr/local/VegitoPraiser/code
ENV NODE_ENV="production"

COPY ./build /usr/local/VegitoPraiser/code
COPY ./node_modules /usr/local/VegitoPraiser/node_modules
COPY db_prod.env /usr/local/VegitoPraiser/db_prod.env
COPY db_scheduler_prod.env /usr/local/VegitoPraiser/db_scheduler_prod.env

RUN ls /usr/local/VegitoPraiser
CMD ["node", "main.js"]