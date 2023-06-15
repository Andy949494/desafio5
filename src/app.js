import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import {Server} from "socket.io";
import {engine} from 'express-handlebars';
import ProductManager from './dao/ProductManager.js';
import cartsRouter from './routes/carts.routerDB.js';
import productsRouter from './routes/products.routerDB.js';
import messageModel from './dao/models/messages.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
//fix for __dirname
const productsManager = new ProductManager(`${__dirname}/products.json`);

app.engine('handlebars', engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://CoderUser:hola1234@ecommerce.ph9gf4t.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}
    }),
    secret: 's3cr3t',
    resave: false,
    saveUninitialized: false
}));

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/',viewsRouter);

const httpserver = app.listen(8080,()=>console.log("Listening"))
const io = new Server(httpserver);

const connection = mongoose.connect(`mongodb+srv://CoderUser:hola1234@ecommerce.ph9gf4t.mongodb.net/?retryWrites=true&w=majority`)

io.on('connection',async(socket)=>{
    console.log('New connection.')
    const products = await productsManager.getProducts()
    socket.emit('data_update',{products})
    socket.on('delete_product',async(data)=>{
        await productsManager.deleteProduct(parseInt(data))
        const updateProducts=await productsManager.getProducts()
        console.log(updateProducts)
        io.sockets.emit('update_from_server',updateProducts)
    })
  
    socket.on('new_product_to_server',async(data)=>{
        const newproduct=await productsManager.addProduct(data)
        console.log(newproduct)
        const newproducts=await productsManager.getProducts()
        io.sockets.emit('new_products_from_server',newproducts)
    })
})

const logs = []

io.on('connection',socket =>{
    console.log("Connected")
    socket.on("message", async data=>{
        logs.push({socketid:socket.id,message:data})
        let user = socket.id;
        let message = data;
        await messageModel.create({user,message});
        io.emit('log',{logs});
    })
})
