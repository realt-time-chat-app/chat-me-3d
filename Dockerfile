## Build stage
#FROM node:20 AS build
#
#WORKDIR /app
#
## Copy package.json and package-lock.json
#COPY package.json package-lock.json ./
#RUN npm ci --include=dev
#
## Copy source files
#COPY . .
#
## Copy .env file for Vite to use during build
#COPY .env .env
#
## Build the application
#RUN npm run build
#
## Production stage
#FROM node:20 AS production
#
#WORKDIR /app
#
## Copy built app from the build stage
#COPY --from=build /app/dist /app/dist
#
## Install serve to serve the production build
#RUN npm install -g serve
#
## Expose port
#EXPOSE 5170
#
## Start the production server
#CMD ["serve", "-s", "dist", "-l", "5170"]


# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY . .

# Accept build-time arguments
ARG VITE_USER_SERVICE_URL
ENV VITE_USER_SERVICE_URL=${VITE_USER_SERVICE_URL}

# Build with Vite
RUN npm run build

# Stage 2: Serve the built app
FROM nginx:alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5170
# CMD [ "npm", "run", "start" ]
CMD ["nginx", "-g", "daemon off;"]
