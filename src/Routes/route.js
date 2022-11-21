import express from "express";
const router = express.Router();

import { createUser, login } from "../Controllers/userController.js";
import { createProduct,dislikeProduct,favoriteProduct,getAllProducts,likedProduct } from "../Controllers/productController.js";
import {auth} from '../Middleware/auth.js'

//------------- user API's  ---------
router.post('/register', createUser);
router.post('/login', login)
//------------- products API's -------------
router.post('/createProduct',auth, createProduct)
router.put('/likedProduct',auth, likedProduct)
router.put('/dislikeProduct', auth, dislikeProduct)
router.get('/getAllProducts',auth, getAllProducts)
router.get('/favoriteProduct',auth, favoriteProduct)


router.get('/', (req, res)=>{
    return res.status(200).send({status:true, message: "Welcome to Ankit's App", data:`
    Brief on Assignment-----
    Dependencies – Express(as framework), mongoDb(as Database), JsonWebToken (token generation and decryption), Nodemon (server AutoStart after updating)
    APIs – there are total 7 APIs : 
    •	/register – for signup process (having fields are – firstName, lastName, email, phone, gender, password)
    •	/login – this will help us to Authentication process and token generation, token will be shown in response.body
    •	/createProduct – here in this API product information need to add to create product document, needed fields – (productName, productDescription, price, currencyID)
    •	/likeProduct-  putting productid or productName in  request body will help you to like that product.
    •	/dislikeProduct – dislike is same as like product, it will remove the product from favoriteProduct Array.
    •	/getAllProducts- this will bring you all product have created by user. Also you will found pagination in this area, you just need to give pageNumber in query params.
    •	/favoriteProduct- this will bring you your selected favorite products .
    (Note = for authentication/authorization you need to put token in every product related APIs, in request headers section.)
    `})
})

export default router;
