FROM strapi/base

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./client/package.json ./client/
COPY ./client/package-lock.json ./client/

RUN npm install --silent
RUN npm -prefix ./client/ install ./client/ --silent

COPY . .

RUN npm run build
RUN npm --prefix ./client/ run build ./client/

EXPOSE 1337
#EXPOSE 8443

CMD ["npm", "start"]
