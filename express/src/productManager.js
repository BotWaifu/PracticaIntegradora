import fs from "fs";

export class ProductsManager {
    constructor() {
        this.path = "./products.json";
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const products = await this.getProducts();
            
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.error("Todos los campos son obligatorios");
                return;
            }

            const existCode = products.some(product => product.code === code);

            if (existCode) {
                console.error("Código en uso, por favor escribir otro");
                return;
            }

            const newProduct = {
                id: products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            products.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            
            console.log("Producto agregado:", newProduct);
        } catch (error) {
            console.error(error);
        }
    }

    async getProducts() {
        try {
            const productsData = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsData);
            return products;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}