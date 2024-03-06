import express from "express";
import {ProductsManager} from "./productManager.js";

const products = new ProductsManager ("./products.json");
const app = express();

app.use(express.urlencoded({extended : true}));

app.get("/products", async (req , res) => {
    try{
        const {limit} = req.query;

        let allProducts = await products.getProducts();
        
        if(limit){
            allProducts = allProducts.slice(0 , limit);
        }
    
        res.send(allProducts);
    
    }catch (error){
        console.log(error);

        return [];
    }});

    app.get("/products/:pid" , async (req, res ) =>{
        try{
            const pid = parseInt(req.params.pid);
            const prod = await products.getProducts();
            const idFind = prod.find(prod => prod.id === pid);

            if(idFind) return res.send(idFind);
        } catch (error){
            console.log(error, "No se encontro el producto");

            return;
    }})

const PORT = 8080;
app.listen(PORT , () =>{
    console.log(`Listening on port http://localhost:${PORT}/products`);
});