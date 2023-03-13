FROM node:alpine

WORKDIR /usr/app

COPY package.json yarn.lock .

RUN yarn

RUN mkdir back

COPY back/package.json back/yarn.lock ./back

RUN cd back && yarn && cd ..

RUN mkdir front

COPY front/package.json front/yarn.lock ./front

RUN cd front && yarn && cd ..

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]