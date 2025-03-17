# Use the official Node.js image as a base image
FROM node:18

# Install Python and required dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    && pip install --no-cache-dir --break-system-packages numpy pandas \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env.example to .env
COPY .env.example .env

# Copy all the files to the container
COPY . .

# Expose app port and debug port
EXPOSE 3000 9229

# Run the application in debug mode
CMD ["npm", "run", "dev"]