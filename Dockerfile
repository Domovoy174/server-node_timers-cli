# Set the base image.
FROM node:18

# Create and define the node_modules's cache directory.
RUN apt-get update && apt-get install -y iputils-ping
RUN mkdir /api
WORKDIR /api

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY .env ./
COPY package-lock.json ./
RUN npm install

COPY ./app ./app
ENV PORT 3330
EXPOSE $PORT

CMD ["npm", "run", "start"]
