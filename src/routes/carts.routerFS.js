import { Router } from 'express';
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManager.js';
import CartManager from '../dao/CartManager.js';

const router  = Router();
const productsManager = new ProductManager(`${__dirname}/products.json`);
const cartsManager = new CartManager(`${__dirname}/carts.json`);

router.post('/', async (req, res) => {
    try {
        let product = {products: []};
        await cartsManager.addCart(product);
        res.status(200).send('Cart added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        let cart = await cartsManager.getCartById(req.params.cid);
        if (cart){
            res.status(200).send(cart.products);
        } else {
            return res.status(404).send('Cart id not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let product = await productsManager.getProductById(req.params.pid)
        let cart = await cartsManager.getCartById(req.params.cid)
        if (product && cart) {
            await cartsManager.updateCart(req.params.cid, req.params.pid);
        res.status(200).send('Product added successfully');
        } else if (!product){
            return res.status(404).send('Product id not found.');
        } else if (!cart){
            return res.status(404).send('Cart id not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

export default router;