import mongoose from "mongoose";
// const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        unique: true
    },
    productDescription:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    currencyId:{
        type: String,
        default: 'INR',
        enum: ["INR", "USD", "RUB"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps:true})

export default mongoose.model('product',productSchema)
