import express from "express";
import cors from "cors";
import usersRouter from "../routes/users.js";
import authRouter from "../routes/auth.js";
import categoriesRouter from "../routes/categories.js";
import productsRouter from "../routes/products.js";
import searchRouter from "../routes/search.js";
import uploadsRouter from "../routes/uploads.js";
import fileUpload from "express-fileupload";
import { dbConnection } from "../database/config.js";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import socketController from "../sockets/socker_controller.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server);
    this.databaseConnection();
    this.middlewares();
    this.routes();
    this.sockets();
  }

  async databaseConnection() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // BODY PARSER
    this.app.use(express.json());
    // PUBLIC DIRECTORY
    this.app.use(express.static("public"));
    // FILE UPLOADS
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use("/api/users", usersRouter);
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/categories", categoriesRouter);
    this.app.use("/api/products", productsRouter);
    this.app.use("/api/search", searchRouter);
    this.app.use("/api/uploads", uploadsRouter);
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
