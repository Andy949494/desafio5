import mongoose from 'mongoose';

const collection = 'carts';

const schema = new mongoose.Schema({
    products:{
        type:[{
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
                },
            quantity: {
                type: Number
            }
            }],
        default: []
    }
})

const cartsModel = mongoose.model(collection,schema);
export default cartsModel;