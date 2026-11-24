FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node server/ ./server/
USER node
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server/server.mjs", "--host", "0.0.0.0"]
