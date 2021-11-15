const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const User = require('./model/user')

require('dotenv').config();

const app = express()
app.use(cors())


const mongoUsername = process.env.MONGO_USERNAME
const mongoPwd = process.env.MONGO_PASSWORD
const clusterUrl = "localhost:27017/myFirstDB"
const uri = `mongodb://${mongoUsername}:${mongoPwd}@${clusterUrl}`

mongoose.connect(uri)
.then(() => {
    console.log('Mongodb connected...')
})

app.post('/api/register', async (req, res) => {
    
})

app.get('/',(req, res) => {
    res.send('<h1>Coming soon...</h1>')
})

const PORT = 5000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)