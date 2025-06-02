FROM node:lts-alpine
HEALTHCHECK --interval=1s --timeout=1s --start-period=1s --retries=30 \
  CMD [ "/bin/sh", "-c", "if [ -f /tmp/started ]; then exit 0; else curl -f http://localhost/ | grep 'ALIVE' && touch /tmp/started || exit 1; fi" ]
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install --production && npm cache clean --force
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

CMD [ "npm", "start" ]