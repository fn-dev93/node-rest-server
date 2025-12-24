class Message {
  constructor(uid, name, message) {
    this.uid = uid;
    this.name = name;
    this.message = message;
  }
}

class ChatMessage {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  last10(uid) {
    const publicMessages = this.messages.filter((msg) => msg.uid === "" || msg.uid === uid);
    return publicMessages.slice(-10);
  }

  get usersArr() {
    return Object.values(this.users);
  }

  sendMessage(uid, name, message) {
    this.messages.push(new Message(uid, name, message));
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}

export default ChatMessage;
