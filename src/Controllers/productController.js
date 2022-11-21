import productModel from "../Models/ProductModel.js";
import { isValidBody } from "../Validation/validation.js";
import userModel from "../Models/UserModel.js";

const createProduct = async function (req, res) {
    try {
        let data = req.body;
        const {productName, productDescription, price} = data
    
        //==========  incoming fields check ===========
        if (Object.keys(data).length===0) return res.status(401).send({status:false, message:'Please enter mandatory fields to add product'}) ;

        //============= Validations ==================        
        if(!isValidBody(productName)) return res.status(401).send({status:false, message:'Please enter mandatory "product name"'}) ;
        if(!isValidBody(price)) return res.status(401).send({status:false, message:'Please enter mandatory "price"'}) ;
        if(!isValidBody(productDescription)) return res.status(401).send({status:false, message:'Please enter mandatory product Description'}) ;

        // ======= Doublicate Product Name check ==========
        let productExists = await productModel.findOne({productName:productName});
        if(productExists) return res.status(400).send({status:false, message: 'this product with this name already exists'});

        //======  creating product =================
        const create = await productModel.create(data);
        res.status(201).send({status: true, message:`product -${productName} added to product list at price - ${price} ${create.currencyId} and productId - ${create._id}`})
        
    } 
    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

const likedProduct = async function (req, res) {
    try {
        let data = req.body;
        const {productName, productId} = data
        // console.log(token);
        let extractedEmailId = req.emailId;
        if(Object.keys(data).length===0 || !isValidBody(data)) return res.status(401).send({status: false, message:'please enter product Id or productName'})

        //--------DB call for product fetch -----------
        let productCheck = await productModel.findOne({$or:[{_id:productId}, {productName:productName}]});
        console.log(productCheck);
        if (!productCheck) return res.status(404).send({status: false, message:'product with this name or Id does not exist'});

        //----------DB check for valid user -----------
        let userUpdate = await userModel.findOneAndUpdate({email:extractedEmailId},{$addToSet:{favoriteProduct:{productId:productCheck._id}}},{new:true}).select({_id:1,email:1,favoriteProduct:1});
        if(!userUpdate) return res.status(404).send({status:false, message:"please register with us first"})

        return res.status(200).send({status:true,message:`product - ${productCheck.productName} has been added to your favorite list`, data:userUpdate})

    } 
    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

const dislikeProduct = async function (req, res){
    try {
        let data = req.body;
        const {productName, productId} = data
        
        let extractedEmailId = req.emailId;
        if(Object.keys(data).length===0 || !isValidBody(data)) return res.status(401).send({status: false, message:'please enter product Id or productName'})   
        
        //--------DB call for product fetch -----------
        let productCheck = await productModel.findOne({$or:[{_id:productId}, {productName:productName}]});
        console.log(productCheck);
        if (!productCheck) return res.status(404).send({status: false, message:'product with this name or Id does not exist'});

        //----------DB check for check product already in list -----------
        let userUpdate = await userModel.findOneAndUpdate({email:extractedEmailId},{$pull:{favoriteProduct:{productId:productCheck._id}}},{new:true}).select({_id:1,email:1,favoriteProduct:1});
        if(!userUpdate) return res.status(404).send({status:false, message:"please register with us first"})

        return res.status(200).send({status: true, message:'product removed from favorite list successfully',data:userUpdate})       
    } 

    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

const favoriteProduct = async function (req, res) {
    try {
        let extractedemailId = req.emailId;
        //--------- DB call for user --------------
        let checkUser = await userModel.findOne({email:extractedemailId}).populate('favoriteProduct.productId').select('favoriteProduct');
        if(!checkUser) return res.status(404).send({status:false, message:"Please resgister with us first."})

        return res.status(200).send({status:false, message:'all favorite product list are---', data: checkUser})   
           
    } 
    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

const getAllProducts = async function (req, res){
    try {
        let pageNumber = req.query.pageNumber
        let productsData = await productModel.find().skip(3*((pageNumber)-1)).limit(3)

        return res.status(200).send({status: true, message: 'the products will be shown below', data : productsData})
    } 
    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

export { createProduct,likedProduct, favoriteProduct, getAllProducts, dislikeProduct };

 