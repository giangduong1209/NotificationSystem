const jwt = require('jsonwebtoken')
module.exports = (req,res,next) =>{
    const {token} = req.body
    const {JWT_SECRET} = process.env
    if(!token){
        return res.status(401).json({code:0,message:"Vui lòng cung cấp token"})
    }
    jwt.verify(token,JWT_SECRET,((err,data)=>{
        if(err){
            console.log(err)
            return res.status(401).json({code:0,message:"Token không hợp lệ hoặc hết hạn"})
        }
        req.body = data 
        next();
    }))
}