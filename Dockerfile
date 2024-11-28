# Use the Node.js LTS version as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Use the environment file for configuration
ENV NODE_ENV=production

# Specify the command to run your app
CMD ["node", "servermain.js"]
