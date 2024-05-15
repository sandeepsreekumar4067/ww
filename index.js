const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose")
const webtoken = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { usermodel, Locationmodel, shopmodel, itemModel } = require("./db")
const app = express();
const cors = require("cors")
const bcrypt = require("bcrypt")
const upload = multer({ dest: "./uploads" })
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(upload.any())
const key = process.env.JWT_KEY
const url = process.env.MONGO_URL
const admin = {
    admin1: "admin1",
    admin2: "admin2",
    admin3: "admin3"
}
const password = {
    password1: "Zxaswe@4012#*",
    password2: "QscEfb%&",
    password3: "!wdv@efb8088^"
}
const crendentials = [
    {
        admin1: "admin1",
        password1: "Zxaswe@4012#*",
    },
    {
        admin2: "admin2",
        password2: "QscEfb%&",
    },

    {
        admin3: "admin3",
        password3: "!wdv@efb8088^"

    }
]
const admin1 = "admin1"
const admin2 = "admin2"
const admin3 = "admin3"
const admin4 = "admin4"
const password1 = "Zxaswe@4012#*"
const passowrd2 = "QscEfb%&"
const password3 = "!wdv@efb8088^"
const password4 = "+pkn_okn~qsc#rgn"
const keyOne = webtoken.sign({ admin1, password1 }, key);
mongoose.connect(url)
    .then(() => {
        console.log("MongoConnected");
    })
    .catch((err) => {
        console.log(err);
    });
//sign in end point to make the user signup and to check if the same user exists or not raising an exception
app.post("/signin", async (req, res) => {
    const body = req.body
   
    try {
        const response = await usermodel.create({
            username: req.body.username,
            password: req.body.password
        }); 
        const token = webtoken.sign(body, key)
        res.status(200).json({
            token: token,
            message: "User created successfully"
        });
    } catch (err) {
        
        res.status(500).json({ error: "Internal Server Error" });
    }
});
///login end point to check the data base if the user exists and also cross checks the password
app.post("/login", async (req, res) => {
    const body = req.body
    try {
        const { username, password } = req.body;
        const existingUser = await usermodel.findOne({ username });
        if ((username == admin1 && password == password1) || (username == admin2 && password == passowrd2) || (username == admin3 && password == password3)||(username == admin4 && password == password4)) {
            const token = webtoken.sign(body, key)
            const len = token.length
            const charactersToInsert = ['<', '>', '|', '{', '}', '?'];
            function insertRandomCharacters(inputString, characters) {
                // Generate random indices to insert characters
                const indices = [];
                for (let i = 0; i < characters.length; i++) {
                    indices.push(Math.floor(Math.random() * (inputString.length + 1)));
                }
                // Sort the indices in ascending order
                indices.sort((a, b) => a - b);
                // Insert characters at random indices
                let modifiedString = inputString;
                let offset = 0; // Offset to adjust the index when inserting characters
                for (let i = 0; i < indices.length; i++) {
                    const index = indices[i] + offset;
                    modifiedString = modifiedString.slice(0, index) + characters[i] + modifiedString.slice(index);
                    offset += 1; // Increase offset after insertion
                }
                return modifiedString;
            }
            const modifiedString = insertRandomCharacters(token, charactersToInsert)

            res.status(200).json({
                message: "Login Successfull",
                token: modifiedString
            })
        }
        else {
            const token = webtoken.sign(body, key)
            if (!existingUser) {
                return res.status(400).json({ error: "User does not exist" });
            } else {
                res.json({
                    token: token,
                    message: "Login successful"
                }).status(200);
            }
        }
    } catch (err) {
       
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Tourist Location formsubmission end point

app.post("/formsubmission", async (req, res) => {
    const values = req.body;
    const file = req.files[0];
    const path = file.path;
    const imageRes = await cloudinary.uploader.upload(path)
    const imageUrl = imageRes.url;
    try {
        await Locationmodel.create(
            {
                locationName: req.body.locationName,
                brochure: req.body.brochure,
                district: req.body.district,
                Image: imageUrl
            }
        )
        res.json("Successfully added").status(200)

    } catch (err) {
        res.status(400).json("failed to add")
    }
})

//get loaction

app.post("/getlocation", async (req, res) => {
    try {
        const response = await Locationmodel.find({ district: req.body.place })
        res.status(200)
        res.json(response)
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
})

//location Details in shopowner 

app.post("/shopfetch", async (req, res) => {
    try {
        const response = await Locationmodel.findOne({ locationName: req.body.locationNameData }).populate('shops')
        res.status(200)
        res.json(response)
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
})

app.post("/shopformsubmission", async (req, res) => {
    try {
        const file = req.files[0].path
        const filepath = await cloudinary.uploader.upload(file)
        const shopRes = await shopmodel.create({
            shopName: req.body.shopname,
            shopBrochure: req.body.brochure,
            shopImage: filepath.url,
            shopLocation:req.body.mapCordinates
        })
        await Locationmodel.findOneAndUpdate({ locationName: req.body.locationName }, { $push: { shops: shopRes._id } })
        res.status(200).json("Successfully added")
    } catch (err) {
        res.status(400).json(err)
    }

})

app.post("/shopinterfaceload", async (req, res) => {
    try {
        const response = await shopmodel.findOne({ shopName: req.body.shopn }).populate("item")
        res.json(response).status(200)
    } catch (err) {
        res.json(err).status(400)
    }
})

app.post("/itemFormSubmission", async (req, res) => {
    const itemName = req.body.itemName
    const itemPrice = req.body.itemPrice
    const shopname = req.body.shopName
    const file = req.files[0].path
    const filepath = await cloudinary.uploader.upload(file)
    try {
        const response = await itemModel.create({
            itemName: itemName,
            itemPrice: itemPrice,
            itemImage:filepath.url
        })
        const allres = await shopmodel.findOneAndUpdate({ shopName: shopname }, { $push: { item: response._id } })

        res.json("successfully added").status(200)
    } catch (err) {
        res.json(err).status(400)
    }
})
app.post("/deletelocation",async(req,res) =>{
   const id = req.body.id
   try{
    ;
     const resp = await Locationmodel.findByIdAndDelete({_id : id})
    
     res.json("item deleted").status(200)
   }
   catch(e){
    res.sendStatus(400)
   }
})
app.post("/deleteItem",async(req,res) =>{
    const id = req.body.id
    try{
      const resp = await itemModel.findByIdAndDelete({_id : id})
      res.json("item deleted").status(200)

    }
    catch(e){
     res.sendStatus(400)
    }
 })
app.post("/deleteShop",async (req,res)=>{
    const id = req.body.id
   try{
    const resp = await shopmodel.findByIdAndDelete({_id:id})
    res.json("Shop Deleted").status(200)
   
   }catch(e){
    res.json("internal server error").status(400)
   }
})
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

