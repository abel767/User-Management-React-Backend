const express = requir('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')


dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/api/users', userRoutes)

const PORT = 3000
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
})
