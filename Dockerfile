FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

ENV NEXT_PUBLIC_MYENV=stg

RUN npm run build

CMD ["npm", "run", "start"]
