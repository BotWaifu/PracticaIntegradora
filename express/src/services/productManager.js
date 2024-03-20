import fs from 'fs';

export  class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.readProductsFromFile();
  }

  //metodo de lectura de archivo json
  async readProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      this.products = JSON.parse(data);
      this.nextId =
        this.products.length > 0
          ? Math.max(...this.products.map((p) => p.id)) + 1
          : 1;
    } catch (error) {
      console.error("Error durante la lectura del archivo:", error.message);
      this.products = [];
    }
  }

  //metodo para la escritura de archivos
  async writeProductsToFile() {
    fs.promises.writeFile(
      this.filePath,
      JSON.stringify(this.products, null, 2),
      "utf-8"
    );
  }

  //metodo de busqueda de id
  async findProductIndex(id) {
    return this.products.findIndex((product) => product.id === id);
  }

  //Para obtener todos los productos
  async getProducts() {
    await this.readProductsFromFile();
    return this.products;
  }

  //Para obtner solo un producto
  async getProductById(id) {
    await this.readProductsFromFile();
    const product = this.products.find((product) => product.id == id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }

  //Para agregar un nuevo producto
  async addProduct({ title, description, price, thumbnails, code, stock, status, category}) {
    await this.readProductsFromFile();
    
    //Verifico que el campo code no sea repetido
    if (this.products.find((product) => product.code === code)) {
      throw new Error("El campo code del producto ya existe, deberia cambiar el nombre.");
    }

    const newProduct = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category
    };

    this.products.push(newProduct);
    await this.writeProductsToFile();
    return newProduct;
  }

  //Actualizar un producto
  async updateProduct(id, updates) {
    await this.readProductsFromFile();
    const productIndex = await this.findProductIndex(id);
    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }
   
    if (updates.code && this.products.some(
        (product) => product.code === updates.code && product.id !== id
    )){
      throw new Error("El código del producto ya existe en otro producto.");
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updates,
    };
    await this.writeProductsToFile();
    return this.products[productIndex];
  }

  //Eliminar un producto
  async deleteProduct(id) {
    await this.readProductsFromFile();
    const productIndex = this.products.findIndex((product) => product.id == id);
    if (productIndex === -1) {
      throw new Error("Producto no encontrado para eliminar.");
    }
    this.products.splice(productIndex, 1);
    await this.writeProductsToFile();
    return { message: "Producto eliminado con éxito." };
  }
}