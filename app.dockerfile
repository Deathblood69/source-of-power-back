FROM node:lts

WORKDIR /src

COPY . .
RUN rm -rf ./node_modules
RUN npm install -g @nestjs/cli
RUN npm i
RUN rm .env
RUN mv .env.production .env
RUN nest build
EXPOSE 3000

CMD ["npm", "run", "start"]
