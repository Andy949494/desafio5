import { Router } from 'express';
import { uploader } from '../utils.js';
import __dirname from '../utils.js';
import ProductManager from '../dao/ProductManager.js';
import bodyParser from 'body-parser';

const router  = Router();
const productsManager = new ProductManager(`${__dirname}/products.json`);

router.use(bodyParser.json()); //Middleware para analizar los datos json.

router.get('/', async (req, res) => {
    try {
        let products = await productsManager.getProducts();
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

router.get('/:pid', async (req, res) => {
    try {
        let product = await productsManager.getProductById(req.params.pid)
        if (product) {
            res.status(200).send(product);
        } else {
            return res.status(404).send('Id not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.post('/', uploader.array('thumbnails'), (req, res) => {
    try{
        if (req.body.status) {
            req.body.status = Boolean(req.body.status); //Convertir status en boolean.
        }
        if (req.body.price) {
            req.body.price = parseFloat(req.body.price); //Convertir price a float.
        }
        if (req.body.stock) {
            req.body.stock = parseInt(req.body.stock); //Convertir stock a int.
        }
        let product = req.body;
        if (req.files.length > 0) {
            let fileNames = req.files.map(file => `http://localhost:8080/images/${file.filename}`); //la función flecha transforma cada elemento del arreglo req.files en una URL completa de la imagen y se almacena en el arreglo fileNames.
            product.thumbnails = fileNames;
        } else {
            product.thumbnails = [];
        }
        productsManager.addProduct(product);
        res.status(200).send('Product added successfully');
    } catch {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        let product = await productsManager.getProductById(req.params.pid)
        if (product) {
            let update = req.body;
            await productsManager.updateProduct(req.params.pid, update);
            return res.status(200).send('Product updated successfully');
        } else {
            return res.status(404).send('Id not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        let product = await productsManager.getProductById(req.params.pid)
        if (product) {
            await productsManager.deleteProduct(req.params.pid)
            return res.status(200).send('Product deleted successfully');
        } else {
            return res.status(404).send('Id not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});
export default router;