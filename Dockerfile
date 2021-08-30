FROM node

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json yarn.* ./

RUN yarn

COPY . /home/node/app/

EXPOSE 3333

CMD ["node","ace","serve","--watch"]
