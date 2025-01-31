import { io, Socket } from "socket.io-client";

class SocketService {
  socket: Socket | null = null;

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId },
        transports: ["websocket"],
        timeout: 5000,
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });
    }
  }

  joinRoom(roomId: string) {
    this.socket?.emit("joinRoom", roomId);
  }

  sendMessage(message: any) {
    this.socket?.emit("sendMessage", message);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on("newMessage", callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
