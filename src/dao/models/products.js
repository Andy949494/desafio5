import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const collection = 'products';

const schema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    code:{
        type:String,
    },
    price:{
        type:Number,
    },
    status:{
        type:String,
    },
    stock:{
        type:Number,
    },
    category:{
        type:String,
    },
    thumbnails:{
        type:Array,
        default: []
    }
})

schema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collection,schema);
export default productsModel;