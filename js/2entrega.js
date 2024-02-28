const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = "./products.json";
        this.products = [];
        this.initialize();
    }

  data() {
    console.log(this.products);
  }
  async initialize() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(data);
        console.log("Productos inicializados:", this.products);
    } catch (error) {
        console.error("ERROR al inicializar los productos", error);
    }
}
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
        // Validar campos obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Complete los campos obligatorios del nuevo producto.');
        }
        // Encontrar repeticiones de n° de código
        if (this.products.some(product => product.code === code)) {
            throw new Error('Este código de producto ya se encuentra registrado.');
        }
        // Generador de ID
        const id = this.products.length + 1;
        // Agregar el producto a la lista
        const newProduct = { id, title, description, price, thumbnail, code, stock };
        this.products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        console.log(`Producto "${newProduct.title}" agregado correctamente`);
    } catch (error) {
        console.error('ERROR al agregar el producto', error);
    }
};


async getProducts() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("ERROR al leer el archivo", error);
        return [];
    }
}

  async getProductById(id) {
    try {
      const productId = parseInt(id);
      const product = this.products.find((product) => product.id === productId);
      if (product) {
        console.log(`El producto con el id ${id} fue encontrado:`, product);
        return product;
      } else {
        console.error(`El producto con id ${id} no fue encontrado`);
        return null;
      }
    } catch (error) {
      console.error("Error buscando producto", error);
      return null;
    }
  }

  async deleteProduct(id) {
    const deleteForId = this.products.findIndex((product) => product.id === id);
    if (deleteForId === -1) {
      console.error("Producto no encontrado");
      return;
    }
    this.products.splice(deleteForId, 1);

    await new Promise((resolve) => setTimeout(resolve, 100));

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, "\t")
    );
    console.log(`El producto con el id ${id} fue borrado correctamente`);
  }

  async updateProduct(id, updatedProductData) {
    try {
        let products = await this.getProducts();

        // Buscar el producto por ID
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(`No se encontró un producto con el ID ${id}`);
        }

        // Actualizar el producto
        products[index] = { ...products[index], ...updatedProductData };

        // Escribir la lista actualizada de productos de vuelta al archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, '\t'));
        console.log(`Producto con ID ${id} actualizado correctamente`);
    } catch (error) {
        console.error('ERROR al actualizar el producto', error);
    }
}

}

let product = new ProductManager();

const newProduct = {
    title: 'Peluche Anime', 
    description: 'Peluche de Iguro - Kimetsu no yaiba', 
    price: 15.99, 
    thumbnail: 'pelucheiguro.jpg', 
    code: 'C001', 
    stock: 10
};

const newProduct2 = { 
    title: 'Figura Anime', 
    description: 'Figura Denji SEGA - Chainsaw Man', 
    price: 70.99, 
    thumbnail: 'figuradenji.jpg', 
    code: 'C002', 
    stock: 5
};

const newProduct3 = { 
    title: 'Set de Arte', 
    description: 'Ranma 1/2', 
    price: 20.00, 
    thumbnail: 'ranma.jpg', 
    code: 'A003', 
    stock: 1
};

// Funciona
product.addProduct(newProduct);

//Actualiza Titulo y Descripcion.
product.updateProduct(1, { title: "Set de Arte", description: "Ranma 1/2" });

//Vuelvo a llamar al Producto 1 con los datos actualizados.
product.getProductById(1);

//No actualiza ID.
product.updateProduct(1, { id: 3, title: "Set de Arte", description: "Ranma 1/2" });
product.getProducts();

//Se puede ver aqui.
product.getProductById(3);

//Nuevos Productos.
product.addProduct(newProduct2);
product.addProduct(newProduct3);

//Traigo Nuevos Productos
product.getProductById(2);
product.getProductById(3);

//Borro los productos (comentar esto de abajo para ver que se agregan los productos).
product.deleteProduct(1);
product.deleteProduct(2);
product.deleteProduct(3);

product.getProducts();