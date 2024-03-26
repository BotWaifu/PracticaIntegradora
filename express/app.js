import express from 'express';
import cartsRouter from './src/routes/cartsrouter.js';
import productsRouter from './src/routes/productsrouter.js';
import viewsRouter from './src/routes/viewrouter.js';
import handlebars from 'express-handlebars';
import  __dirname  from './util.js';
import { Server } from 'socket.io';
import Sockets from "./sockets.js";
import path from 'path';

const app = express();
const port = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//pequeño mod para que me lea las imagenes de public, despues ver si se puede mejorar
app.use("/public", express.static("public"));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Set up Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'views'));

// Start server
const server = app.listen(port, () =>
  console.log(`Servidor corriendo en http://localhost:${port}`)
);

// Set up WebSocket server
const io = new Server(server);
Sockets(io);