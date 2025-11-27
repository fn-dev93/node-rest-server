import express from "express";
import cors from "cors";
import usersRouter from "../routes/users.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // BODY PARSER
    this.app.use(express.json());
    // PUBLIC DIRECTORY
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use("/api/users", usersRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
