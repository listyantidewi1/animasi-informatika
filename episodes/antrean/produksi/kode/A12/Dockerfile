FROM node:22-alpine
WORKDIR /app
# Pustaka dulu: langkah ini tidak diulang selama package.json tidak berubah
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "src/server.js"]