import userModel from "../Models/UserModel.js";
import { isValidBody, isValidEmail, isValidPassword, isValidPhone, isValidGender } from "../Validation/validation.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";


const createUser= async function(req, res) {
    try{
        let data = req.body;
        let {firstName, lastName, email, phone, gender, password} = data;


        //========= incoming data exist check ==============
        if (Object.keys(data).length===0) return res.status(404).send({status: false, message:'please provide mandatory fields ! '})

        // =============  Validations =============
        if (!isValidBody(firstName)) return res.status(400).send({status: false, message:'please provide mandatory firstName '})
        if (!isValidBody(lastName)) return res.status(400).send({status: false, message:'please provide mandatory lastName '})
        
        if (!isValidGender(gender) || !isValidBody(gender)) return res.status(400).send({status: false, message:'please provide mandatory and valid gender'})
        if (!isValidBody(email) || !isValidEmail(email)) return res.status(400).send({status: false, message:'please provide mandatory and valid email'})
        if (!isValidBody(phone) || !isValidPhone(phone)) return res.status(400).send({status: false, message:'please provide mandatory and valid phone'})
        if (!isValidBody(password) || !isValidPassword(password)) return res.status(400).send({status: false, message:'please provide mandatory and valid password between 8 to 15 characters '})

        //==== Duplicate check on single DataBase call ====
        const emailExist = await userModel.findOne({$or:[{email:email},{phone:phone}]})
        // console.log(emailExist);
        if (emailExist) return res.status(400).send({status: false, message: 'given email or phone already Exists!'})

        let actualPass = data.password;
        data.password =await bcrypt.hash(data.password, 10)

        //======== creating document ========
        const user = await userModel.create(data);
        res.status(201).send({ status: true, message: `Registration successfull. login credentials - userName = ${email} , password = ${actualPass}`, data: user })

    }
    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

//================== logIn ===================

const login = async function (req, res) {
    try {
        let data = req.body;
        const {email, password} = data
    
        if(Object.keys(data).length===0) return res.status(401).send({status: false, message:'please enter login Credentials ! '})
    
        if(!isValidEmail(email) || !isValidBody(email)) return res.status(400).send({status:false, message:'please enter mandatory valid email !'})
        if(!isValidPassword(password) || !isValidBody(password)) return res.status(400).send({status:false, message:'please enter mandatory valid password !'})
    
        let emailExists = await userModel.findOne({email:email})
        if(! emailExists) return res.status(404).send({status: false, message:`No registered email -${email} exists! `})

        const dbPassword = emailExists.password;
        //----------password comparison -----------
        const passwordMatch = await bcrypt.compare(password,dbPassword)

        if(!passwordMatch) return res.status(401).send({status: false, message: "Please provide valid credential"})
        
        //   token creation
        const token = JWT.sign({
            emailId: emailExists.email,
            exp: Math.floor(Date.now() / 1000) + 24*60*60
        }, "weAreIndians");       
    
        res.setHeader("token",token)
        return res.status(200).send({status:true, message: 'login successful',email:email, token: token})
        
    } 
    catch(error){
        res.status(500).send({status: false, message:error.message})
    }
}

export { createUser, login};
