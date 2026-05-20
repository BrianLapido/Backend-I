# Imagen base de node para que Render pueda utilizar en el deploy
FROM node:22-alpine

WORKDIR /app


COPY package*.json ./

# En produccion instalamos solo dependencias que no sean devDependencies
RUN npm ci --omit=dev

COPY . .


RUN mkdir -p src/logs/errors

# El contenedor expone el puerto interno usado por docker_compose.yml
EXPOSE 3000


ENV NODE_ENV=production
ENV PORT=3000

CMD [ "npm", "start" ]
