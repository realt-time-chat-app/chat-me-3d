# chat-me-3d
This is the client for a simple chat app that allows sending and receiving messages via WebSockets.  
Previous messages are fetched from the server (`message-service`), which uses an RPC protocol.

## Development

1. Clone this repository:
   ```sh
   git clone git@github.com:realt-time-chat-app/chat-me-3d.git
   ```  
2. Clone and run the required services:
    - [message-service](https://github.com/realt-time-chat-app/message-service)
    - [user-service](https://github.com/realt-time-chat-app/user-service)

   Ensure that these services are running in separate terminals.

3. Install dependencies:
   ```sh
   npm install
   ```  
4. Start the client in development mode:
   ```sh
   npm run dev
   ```  

## Testing

Run tests with:
```sh
npm run test
```

## Running the Dockerized Version

1. Build the Docker image:
   ```sh
   docker build \
   --build-arg VITE_USER_SERVICE_URL=http://localhost:3003/rpc \
   --build-arg VITE_MESSAGE_SERVICE_URL=http://localhost:3002/rpc \
   --build-arg VITE_SOCKET_URL=http://localhost:3002 \
   -t my-chat-app .
   ```  
2. Run the container:
   ```sh
   docker run -p 5170:5170 my-chat-app
   ```  

   You can change `my-chat-app` to any tag of your choice.  
   Read more about [tagging Docker images](https://docs.docker.com/reference/cli/docker/image/tag/).

## Features Under Development

- Authentication is not yet implemented.
- The [auth-service](https://github.com/realt-time-chat-app/auth-service) is currently in development and will be integrated soon.
- Automatic deployments are set up with Fly.io but are currently paused due to billing.

## Contribution

1. To add a feature or fix a bug, check out a new branch from `develop`:
   ```sh
   git checkout develop
   git checkout -b <feature/branch-name>  # For features
   git checkout -b <bugfix/branch-name>   # For bug fixes
   ```  
2. Submit a pull request (PR) against `develop`.
3. Ensure your branch is free of conflicts and all automated tests pass before submitting the PR.  
