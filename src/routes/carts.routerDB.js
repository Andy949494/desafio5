import cartsModel from '../dao/models/carts.js';
import productsModel from '../dao//models/products.js';
import { Router } from 'express';

const router  = Router();

router.post('/', async (req, res) => {
    try {
        await cartsModel.create({});
        res.status(200).send('Cart added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/', async (req, res) => {
    try {
        let products = await cartsModel.find().populate('products.product');
        // let products = await cartsModel.find();
        let limit = req.query.limit;
        if (limit){
            let LimitedProducts = products.slice(0,limit);
            res.status(200).send(LimitedProducts);
        } else {
            res.status(200).send(products);  
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        let cart = await cartsModel.findById(req.params.cid)
        if (!cart) {
            return res.status(404).send('Id not found.')
        } else {
        return res.status(200).send(cart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let product = await productsModel.findById(req.params.pid)
        let cart = await cartsModel.findById(req.params.cid)

        if (product && cart) {
            const productIndex = cart.products.findIndex((e) => e.product == (req.params.pid));
      if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
        await cartsModel.updateOne({_id:req.params.cid},cart);
        res.status(200).send('Product added successfully');
      } else {
        cart.products.push({ product: (req.params.pid), quantity: 1 });
        await cartsModel.updateOne({_id:req.params.cid},cart);
        res.status(200).send('Product added successfully');
      }
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

router.put('/:cid', async (req, res) => {
    try {
        let cart = await cartsModel.findById(req.params.cid)
        if (!cart) {
            return res.status(404).send('Id not found.')
        } else {    
        let product = req.body;
        cart.products = product;
        await cartsModel.updateOne({_id:req.params.cid},cart);
        return res.status(200).send('Cart updated successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        let newQuantity = parseInt(req.body.quantity);
        let cart = await cartsModel.findById(req.params.cid)
        if (!cart){
            return res.status(404).send('Cart id not found.');
        } else if (cart) {
            const productIndex = cart.products.findIndex((e) => e.product == (req.params.pid));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                await cartsModel.updateOne({_id:req.params.cid},cart);
                return res.status(200).send('Quantity updated successfully');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        let cart = await cartsModel.findById(req.params.cid)
        if (!cart){
            return res.status(404).send('Cart id not found.');
        } else if (cart) {
            const productIndex = cart.products.findIndex((e) => e.product == (req.params.pid));
            if (productIndex !== -1) {
                cart.products.splice(productIndex,1);
                await cartsModel.updateOne({_id:req.params.cid},cart);
                return res.status(200).send('Product deleted successfully');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        let cart = await cartsModel.findById(req.params.cid)
        if (!cart){
            return res.status(404).send('Cart id not found.');
        } else if (cart) {
                cart.products.splice(0);
                await cartsModel.updateOne({_id:req.params.cid},cart);
                return res.status(200).send('All products deleted successfully');
            }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

export default router;