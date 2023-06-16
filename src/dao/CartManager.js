import fs from 'fs/promises';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

    async addCart(product) {
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

    async getCartById(cartId) {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const cart = JSON.parse(content);
      const searchedId = cart.find((e) => e.id == cartId);
      if (!searchedId) {
        console.log('Id not found');
      } else {
        return searchedId;
      }
    } catch (error) {
      console.log(error);
    }
  }

    async updateCart(cartId, productId) {
    try {
      const content = await fs.readFile(this.path, 'utf-8');
      const cart = JSON.parse(content);
      const searchedId = cart.find((e) => e.id == cartId);
      const productIndex = searchedId.products.findIndex((product) => product.product == parseInt(productId));
      if (productIndex !== -1) {
      searchedId.products[productIndex].quantity += 1;
        await fs.writeFile(this.path, JSON.stringify(cart));
      } else {
        searchedId.products.push({ product: parseInt(productId), quantity: 1 });
        await fs.writeFile(this.path, JSON.stringify(cart));
      }
      
    } catch (error) {
      console.log(error);
    }
  }
}