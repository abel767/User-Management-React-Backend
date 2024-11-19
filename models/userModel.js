const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profileImage:{type: String, required: true},
    postImage: {type: String, required: true},
    text: {type: String, required: true}
}, {timestamps: true})

// hashing the password 

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()
        const salt = await bcrypt.getSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model('User', userSchema)
