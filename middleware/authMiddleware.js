const jwt  =require('jsonwebtoken')
const User = require('../models/userModel')

const authMiddleware = async(req,res,next)=>{
    const token = req.header('Authorization')
    if(!token) return res.status(401).json({message: 'mo token, authorization denied'})
        try{
          const decoded = jwt.verify(token,'5eaa92eb7e5cb2fec5456ebf87c296e4baeb891da6f30153159994268b53c4a9820a1cc21811ae70c807b4483ae8fcd5b4185c211b1554e7deab9ec269560c88')
          req.user = await User.findById(decoded.id)
          next()
        }catch(error){
          res.status(401).json({message: 'Token is not valid'})
        }
}

module.exports = {authMiddleware}

