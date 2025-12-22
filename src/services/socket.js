import io from 'socket.io-client';

let socket = null;

export default function getSocket(url = 'https://your-socket-server.example.com', opts = {}) {
  if (!socket) {
    socket = io(url, { transports: ['websocket'], ...opts });
  }
  return socket;
}
