const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./model/user')

require('dotenv').config();

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET
const mongoUsername = process.env.MONGO_USERNAME
const mongoPwd = process.env.MONGO_PASSWORD
const clusterUrl = "localhost:27017/myFirstDB"
const uri = `mongodb://${mongoUsername}:${mongoPwd}@${clusterUrl}`

mongoose.connect(uri,{
    autoIndex: true, //make this also true to be able to use unique: true
})
.then(() => {
    console.log('Mongodb connected...')
})


app.post('/api/change-password', (req,res) => {
    const { token } = req.body
    const user = jwt.verify(token, JWT_SECRET)
    
    console.log(user)
    res.json({status: 'ok'})
})


app.post('/api/login', async (req,res) => {
    const { username, password } = req.body
    
    const user = await User.findOne( { username }).lean()

    if(!user){
        return res.json({status: 'error', error: 'Invalid username/password' })
    }

    if(await bcrypt.compare(password, user.password)){
        // the username, password combination is successful

        const token = jwt.sign({ 
            id: user._id, 
            username: user.username 
        },
            JWT_SECRET
        )
        return res.json({status: 'ok', data: token})
    }
    res.json({status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    const { username, password: plainTextPassword  } = req.body
    const password = await bcrypt.hash(plainTextPassword, 10)
    console.log(password)

    try{
        const response = await User.create({
            username,
            password
        })
        console.log('User created', response)
    } catch(error){
        console.log(error)
        if(error.code === 11000) {
            return res.json( { status: 'error', error: 'Username already exist' } )
        }
        throw error
    }
        res.json( { status: 'ok' } )
})

app.get('/',(req, res) => {
    res.send('<h1>Coming soon...</h1>')
})

app.get('/api/register', async (req, res) => {
    
    res.json(req.body)
})

const PORT = 5000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)