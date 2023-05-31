/* eslint-disable no-undef */
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/user.js'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
const PORT = process.env.PORT || 3000

const connectDB = async () => {
    try {
        console.log('Plese wait database is connecting...')
        await mongoose.connect(process.env.DATABASE_URL);
        console.log(`Database is connected`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => { res.send('Twitter clone server is working...') })

app.post('/newUser', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(200).json({ message: 'User already exists.' })
    }
    User.create(req.body).then(() => res.status(200).json({ message: 'user created successfully.' })).catch(err => { res.send('error creating user' + err) })
})

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);

    })
})