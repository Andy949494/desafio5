import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const allProducts = JSON.parse(content);
      const lastID = allProducts.length ? allProducts[allProducts.length - 1].id : 0;
      const id = { id: lastID + 1 };
      const addition = Object.assign(id, product);
      allProducts.push(addition);
      await fs.writeFile(this.path, JSON.stringify(allProducts));
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const products = JSON.parse(content);
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(productId) {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const product = JSON.parse(content);
      const searchedId = product.find((e) => e.id == productId);
      if (!searchedId) {
        console.log('Id not found');
      } else {
        return searchedId;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(productId, field) {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const product = JSON.parse(content);
      const searchedId = product.find((e) => e.id == productId);
      if (!searchedId) {
        console.log('Id not found');
      } else {
        searchedId.title = field.title ?? searchedId.title;
        searchedId.description = field.description ?? searchedId.description;
        searchedId.code = field.code ?? searchedId.code;
        searchedId.price = field.price ?? searchedId.price;
        searchedId.status = field.status ?? searchedId.status;
        searchedId.stock = field.stock ?? searchedId.stock;
        searchedId.category = field.category ?? searchedId.category;
        searchedId.thumbnails = field.thumbnails ?? searchedId.thumbnails;
        await fs.writeFile(this.path, JSON.stringify(product));
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async deleteProduct(productId) {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const product = JSON.parse(content);
      const searchedId = product.find((e) => e.id == productId);
      if (!searchedId) {
        console.log('Id not found');
      } else {
        const index = product.indexOf(searchedId);
        product.splice(index, 1);
        await fs.writeFile(this.path, JSON.stringify(product));
      }
    } catch (error) {
      console.log(error);
    }
  }
}