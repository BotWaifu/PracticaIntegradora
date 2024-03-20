import { Router } from "express";
import {ProductManager} from '../services/productManager.js'

const productRouter = Router();
const products= new ProductManager("src/data/products.json");

//Controller para todos los productos
productRouter.get(`/`, async (req, res) => {
  try {
      const { limit } = req.query;
      const productList = await products.getProducts();
      res.json(limit ? productList.slice(0, Number(limit)) : productList);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//Controller de busqueda por Id
productRouter.get(`/:id`, async (req, res) => {
  try {
      const { id } = req.params;
      const product = await products.getProductById(id);
      if (product) {
          res.json(product);
      }
  } catch (error) {
      res.status(404).send({ error: "producto no existe" });
  }
});

//Controller para eliminar un producto
productRouter.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  try {
      await products.deleteProduct(Number(id));
      res.status(204).send();
  } catch (error) {
      res.status(404).send({ error: "Producto no encontrado." });
  }
});

//Controller para agregar un producto
productRouter.post(`/`, async (req, res) => {

  //validacion de los campos necesarios
  const { title, description, price, code, stock } = req.body;  
  if (!title || !description || price === undefined || !code || stock === undefined) {
      return res.status(400).send({status: 'Error', error: "Todos los campos son obligatorios excepto thumbnails" });
  }

  //status con valor por defecto en true si no es ingresado
  const status = req.body.status !== undefined ? req.body.status : true; 

  //status con valor por defecto en true si no es ingresado
  const thumbnails = req.body.thumbnails !== undefined ? req.body.thumbnails : []; 

  try {
      const newProduct = await products.addProduct({ title, description, price, code, stock, thumbnails, status });
      res.status(201).json(newProduct);
  } catch (error) {
      console.log(`Error de post ${error}`);
      res.status(400).send({ status: 'Error', error: error.message });
  }
});

//Controller para actualizar un producto
productRouter.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  try {
      const updateProduct = await products.updateProduct(Number(id), req.body);
      res.json(updateProduct);
  } catch (error) {
      if (error.message === "Producto no encontrado.") {
          res.status(404).send({ error: error.message });
      } else {
          res.status(500).send({ error: error.message });
      }
  }
});

export default productRouter;