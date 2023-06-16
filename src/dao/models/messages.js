import mongoose from 'mongoose';

const collection = 'messages';

const schema = new mongoose.Schema({
    user:{
        type:String,
    },
    message:{
        type:String,
    }
})

const messagesModel = mongoose.model(collection,schema);
export default messagesModel;