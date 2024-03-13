import express from 'express'
import cartsRouter from "./src/routes/cartsrouter.js"
import productsRouter from "./src/routes/productsrouter.js"


const port = 8080;
const app = express(); 

app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Test de ingreso
app.get('/api', (req, res) => {
    res.send("Bienvenida")
})

//Use routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use (express.static("public"));

//servicio
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});