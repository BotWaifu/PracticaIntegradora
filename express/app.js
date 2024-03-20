import express from 'express';
import cartsRouter from './src/routes/cartsrouter.js';
import productsRouter from './src/routes/productsrouter.js';
import viewsRouter from './src/routes/viewrouter.js';
import handlebars from 'express-handlebars';
import { __dirname } from './util.js';
import http from 'http'; // Importa el módulo http
import { Server } from 'socket.io';

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', viewsRouter);

app.engine('handlebars', handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Test de ingreso
app.get('/api', (req, res) => {
    res.send('Bienvenida');
});

// Use routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use(express.static('public'));

// Crear servidor HTTP
const httpServer = http.createServer(app);

// Inicializar el servidor HTTP
httpServer.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Crear servidor de sockets
const socketServer = new Server(httpServer);

// Manejar conexiones de sockets
socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado -----> ', socket.id);

    // Emitir eventos para agregar y eliminar productos
    socket.on('newProduct', (product) => {
        socketServer.emit('productList', product);
    });

    socket.on('deleteProduct', (productId) => {
        socketServer.emit('productList', productId);
    });
});
