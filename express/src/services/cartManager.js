import fs from 'fs';

export default class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.readCartsFromFile();
  }

  //Metodo para la lectura del json
  async readCartsFromFile() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      this.carts = JSON.parse(data);
      this.nextId =
        this.carts.length > 0
          ? Math.max(...this.carts.map((p) => p.id)) + 1
          : 1;
    } catch (error) {
      console.error(`Error en la lectura del archivo: ${error.message}`);
      this.carts = [];
    }
  }

  //metodo para la escritura de archivos
  async writeCartsToFile() {
    fs.promises.writeFile(
      this.filePath,
      JSON.stringify(this.carts, null, 2),
      "utf-8"
    );
  }

  //metodo de busqueda de id
  async findCartIndex(id) {
    return this.carts.findIndex((carts) => carts.id == id);
  }

  //metodo para obtner solo un carrito
  async getCartById(id) {
    await this.readCartsFromFile();
    const cart = this.carts.find((cart) => cart.id == id);
    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }
    return cart;
  }

  //Metodo para agregar un nuevo carrito
  async addCart() {
    await this.readCartsFromFile();
    const newCart = {
      id: this.nextId++,
      products: [],
    };
    this.carts.push(newCart);
    await this.writeCartsToFile();
    return newCart;
  }

  //Metodo para agregar para agregar un producto en el carrito
  async addProductToACart(cartId, productDetails, quantity = 1) {
    
    await this.readCartsFromFile();

    const cartIndex = this.findCartIndex(cartId);

    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado.");
    }

    const cart = this.carts.find((cart) => cart.id == cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId == productDetails.id
      );
    
    if (cartIndex === -1) {
      throw new Error("Carrito no encontrado.");
    }
        
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId: productDetails.id, quantity });
    }

    await this.writeCartsToFile();
    return cart;
  }
}