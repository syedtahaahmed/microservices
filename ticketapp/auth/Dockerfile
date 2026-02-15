# FROM node:18-bookworm

# WORKDIR /app
# COPY package.json .
# RUN npm config set strict-ssl false \
#   && npm install
# COPY . .

# CMD ["npm", "start"]



FROM node:18-bookworm

WORKDIR /app
COPY package.json .
RUN npm config set strict-ssl false \
  && npm install

COPY . .

RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]



