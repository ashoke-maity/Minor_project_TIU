import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.SERVER_ROUTE;
const socket = io(import.meta.env.VITE_SERVER_ROUTE);

export default socket;