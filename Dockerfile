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

ARG VITE_MESSAGE_SERVICE_URL
ENV VITE_MESSAGE_SERVICE_URL=${VITE_MESSAGE_SERVICE_URL}
ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
# Build the Vite app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Use custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 5170 instead of 80
EXPOSE 5170
# CMD [ "npm", "run", "start" ]
CMD ["nginx", "-g", "daemon off;"]
