import JWT from "jsonwebtoken";

const authToken = function (token) {
    let tokenValidate = JWT.verify(token,
        "weAreIndians", (err, data) =>{
            if (err) return null;
            else return data
        })
    return tokenValidate
};

const auth = async function (req, res, next) {
    try {
        let token = req.headers.token;
        if(!token) return res.status(401).send({status:false, message: "token must be present"});
        // console.log(token);

        let decodedToken = authToken(token)
        if (!decodedToken)return res.status(401).send({ status: false, message: "Invalid token" })

        // console.log(decodedToken);
        req["emailId"] = decodedToken.emailId

        next()
    } 
    catch (error) {
        return res.status(500).send({ status: "Error", error: error.message })
    }
}

export { authToken, auth }