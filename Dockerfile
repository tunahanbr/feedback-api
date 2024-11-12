# Use the official Node.js 20 image as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Fastify server will run on
EXPOSE 3002

# Command to start the server (assuming your entry point is server.mjs)
CMD ["node", "server.mjs"]
