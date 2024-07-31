# Step 1: Build the React app
FROM node:20 AS build

# Create app directory
WORKDIR /app

# Upgrade npm to the latest version
RUN npm install -g npm@latest

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the React app
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's web directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file (optional)
# If you have a custom nginx.conf, you can uncomment the below line and ensure you have a nginx.conf in your project root
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
