const express = require('express')
const multer = require('multer')
const {authMiddleware} = require('../middleware/authMiddleware')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

// file uploading setup 
const storage  = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'upload/'),
    filename: (req,file,cb) => cb(null,`${Date.now()}-${file.originalname}`)
})

const upload = multer({storage})

// registeration of user 
router.post('/register', async (req,res)=>{
    const {name,email,password} = req.body
    try{
        const user = await User.create({name, email, password})
        const token = jwt.sign({id: user.id},'5eaa92eb7e5cb2fec5456ebf87c296e4baeb891da6f30153159994268b53c4a9820a1cc21811ae70c807b4483ae8fcd5b4185c211b1554e7deab9ec269560c88', {expireIn: '1h'})
        res.status(201).json({token})

    }catch(error){
        res.status(500).json({message: "Error registering user"})
    }
})

// user login
router.post('/login', async(req,res)=>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message:'user not found'})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message: 'Invalid Crendentials'}) 

        const token = jwt.sign({id: user.id}, '5eaa92eb7e5cb2fec5456ebf87c296e4baeb891da6f30153159994268b53c4a9820a1cc21811ae70c807b4483ae8fcd5b4185c211b1554e7deab9ec269560c88')
        res.status(200).json({token})
    }catch(error){
      res.status(200).json({message: 'Error logging in'})
    }
})


// getting the user profile
router.get('/profile', authMiddleware,async(req, res)=>{
    res.json(req.user)
})

// updating user profile 
router.put('/profile', authMiddleware, async(req,res) =>{
    const {name, email} =req.body
    try{
        const user = await res.status(404).json({message: 'User not found'})
        if(!user) return res.status(404).json({message: 'User not found'})

            user.name = name || user.name
            user.email = email || user.email
            await user.save()

            res.json(user)
    }catch(error){
        res.status(500).json({message: 'Error updating profile'})
    } 
}
)


// updating profile piture 

router.post('/upload', authMiddleware, upload.single('profileImage'),async (req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        user.profileImage = `uploads/${req.file.filename}`
        await user.save()

        res.status(200).json({profileImage: user.profileImage})
    }catch(error){
        res.status(500).json({message: 'Error uploading image'})
    }
})


module.exports = router