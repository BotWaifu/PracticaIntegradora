import express from 'express';
import handlebars from "express-handlebars";
import productRouter from "./src/routes/productRouter.js";
import cartRouter from "./src/routes/cartRouter.js";
import viewsRouter from "./src/routes/viewsRouter.js";
import { Server } from "socket.io";
import __dirname from "./src/utils/constansUtil.js";
import mongoose from "mongoose";
import messagemanagerdb from "./src/dao/messageManagerDB.js";
import websocket from "./websocket.js"; // Asumiendo que esta función es válida y está definida en el archivo 'websocket.js'

const app = express();

// URI de conexión a MongoDB
const uri = "mongodb+srv://maria16leon17:<aries0404>@cluster0.klbhxor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Conexión a MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
    // Aquí puedes iniciar tu aplicación Express
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

 
//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "./views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/products", viewsRouter);

// Start server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io integration
const io = new Server(httpServer);
websocket(io);

// Instantiate MessageManagerDB

// Handle Socket.io events
io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("message", async (data) => {
    console.log(`Message received from ${socket.id}: ${data.message}`);
    // Handle message logic here
    try {
      await messagemanagerdb.insertMessage(data.user, data.message);
      io.emit("messagesLogs", await messagemanagerdb.getAllMessages());
    } catch (error) {
      console.error("Error handling message:", error.message);
    }
  });

  socket.on("userConnect", async (data) => {
    try {
      socket.emit("messagesLogs", await messagemanagerdb.getAllMessages());
      socket.broadcast.emit("newUser", data);
    } catch (error) {
      console.error("Error handling user connection:", error.message);
    }
  });
});
