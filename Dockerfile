FROM node:6
MAINTAINER Daniel Lemper <daniel.lemper@pco-online.de>

WORKDIR /usr/src/app/

COPY package.json .
COPY *.js ./
#COPY README.md .

RUN mkdir src #models tests client
COPY src/ src/
#COPY models/ models/
#COPY client/ client/
#COPY tests/ tests/

VOLUME config

RUN npm install
#RUN npm run build

#HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost:3000/ || exit 1
ENV NODE_ENV=production

EXPOSE 3000
CMD node .
