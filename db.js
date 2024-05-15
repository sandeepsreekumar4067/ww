const mongoose = require("mongoose")


const userschema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
})

const LocationSchema = new mongoose.Schema({
    locationName: { type: String, unique: true },
    brochure: String,
    district: String,
    Image : String,
    shops : [{type : mongoose.Schema.ObjectId , ref : 'shopDetails' }]
})

const ShopSchema = new mongoose.Schema({
    shopName: String,
    shopBrochure: String,
    shopImage:String,
    shopLocation : String,
    item : [{type : mongoose.Schema.ObjectId , ref : 'itemModel' }]
})

const itemschema = new mongoose.Schema({
    itemName:String,
    itemPrice:Number,
    itemImage : String
})

const usermodel = mongoose.model("User", userschema)
const Locationmodel = mongoose.model("Location", LocationSchema)
const shopmodel = mongoose.model("shopDetails", ShopSchema)
const itemModel = mongoose.model("itemModel",itemschema)
module.exports = {
    usermodel,
    Locationmodel,
    shopmodel,
    itemModel
}

