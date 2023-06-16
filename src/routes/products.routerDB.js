import productsModel from '../dao/models/products.js';
import { Router } from 'express';
import { uploader } from '../utils.js';

const router  = Router();

router.get('/', async (req, res) => {
    try {
        let products = await productsModel.find();
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
        let product = await productsModel.findById(req.params.pid)
        if (!product) {
            return res.status(404).send('Id not found.')
        } else {
        return res.status(200).send(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.post('/', uploader.array('thumbnails'), async (req, res) => {
    try{
        let {title,description,code,price,status,stock,category,thumbnails} = req.body;
        if(!title||!description||!code||!price||!status||!stock||!category) {
            return res.status(404).send('Incomplete values');}
        if (req.files.length > 0) {
            let fileNames = req.files.map(file => `http://localhost:8080/images/${file.filename}`); //la función flecha transforma cada elemento del arreglo req.files en una URL completa de la imagen y se almacena en el arreglo fileNames.
            thumbnails = fileNames;
        }
        let result = await productsModel.create({
            title,description,code,price,status,stock,category,thumbnails});
            res.status(200).send({status:"succes", payload:result});
    } catch {
        res.status(500).send('Internal server error.');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        let product = await productsModel.findById(req.params.pid)
        if (!product) {
            return res.status(404).send('Id not found.')
        } else {    
        let productToReplace = req.body;
        let pid = req.params.pid;
        await productsModel.updateOne({_id:pid},productToReplace);
        return res.status(200).send('Product updated successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        let product = await productsModel.findById(req.params.pid)
        if (!product) {
            return res.status(404).send('Id not found.')
        } else {    
        let pid = req.params.pid;
        await productsModel.deleteOne({_id:pid});
        return res.status(200).send('Product deleted successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

export default router;