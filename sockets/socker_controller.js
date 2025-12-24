import { verifyJWTToken } from "../helpers/generate_jwt.js";
import ChatMessage from "../models/chat_messages.js";

const chat = new ChatMessage();

const socketController = async (socket, io) => {
  const token = socket.handshake.headers["authorization"];

  const user = await verifyJWTToken(token);
  if (!user) {
    console.log("Invalid token. Disconnecting socket.");
    return socket.disconnect();
  }
  chat.connectUser(user);
  io.emit("active-users", chat.usersArr);

  socket.join(user.id); // Join to a room identified by the user's ID
  socket.on("disconnect", () => {
    chat.disconnectUser(user.id);
    io.emit("active-users", chat.usersArr);
  });

  socket.on("send-message", ({ uid, message }) => {
    console.log({ uid, message });
    if (uid) {
      // Private message
      chat.sendMessage(user.id, user.name, message);
      socket.to(uid).emit("private-message", chat.last10(user.id));
    } else {
      // Public message
      chat.sendMessage("", user.name, message);
      io.emit("recieve-messages", chat.last10(user.id));
    }
  });
};

export default socketController;
