import Express from "express";
import mongoose from "mongoose";
import route from './Routes/route.js'
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({extended:true}));

//------------ mongoDB connect --------------
mongoose.connect('mongodb+srv://ankitg99641:mongo123@cluster0.zdrae.mongodb.net/Qodestek?retryWrites=true&w=majority',{useNewUrlParser: true})
.then(()=>console.log("MongoDb is Connected !!!"))
.catch((err)=>console.log(err))

//------------ use routes --------------
app.use('/', route)

//------------ PORT running ----------------
app.listen(process.env.PORT || 3000, ()=>{console.log("server is ready to use")})