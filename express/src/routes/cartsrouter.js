import {Router} from "express";
import CartManager from '../services/cartManager.js'
import ProductManager from '../services/productManager.js'

const cartsRouter = Router ();
const carts = new CartManager ('src/data/cart.json')
const products = new ProductManager("src/data/products.json");

//Controller de busqueda por Id
cartsRouter.get(`/:cid`, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await carts.getCartById(cid);
    if (cart) {
      res.json(cart);
    }
  } catch (error) {
    res.status(404).send({ error: "carrito no existe" });
  }
});

//Para agregar un carrito
cartsRouter.post(`/`, async (req, res) => {
  try {
// Para agregar un nuevo carrito
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Para agregar un producto en el carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const productDetails = await products.getProductById(pid);  
    if(!productDetails){
      return res.status(400).send({error: 'Producto no encontrado'});
    }
    const updateCart = await carts.addProductToACart(cid, productDetails);
    res.status(201).json(updateCart);
  } catch (error) {
    res.status(500).send(
      { status: 'Error', error: error.message }
    );
  }
});

export default cartsRouter;