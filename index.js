/* eslint-disable no-undef */
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/user.js'
import Tweet from './models/tweet.js'
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

app.get('/logged-in-user/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(200).json({ message: 'user found successfully', data: user })
        }
        res.status(404).json({ message: 'user not found', data: null })

    } catch (error) {
        res.status(500).json({ message: 'Somthing goes wrong', data: null })
    }
})
app.post('/newUser', async (req, res) => {

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(200).json({ message: 'User already exists.', data: user })
    }
    User.create(req.body).then((response) => res.status(200).json({ message: 'user created successfully.', data: response })).catch(err => { res.send('error creating user' + err) })
})

app.post('/tweet', async (req, res) => {
    const { imageUrl, tweet, userId } = req.body;
    Tweet.create({ imageUrl, tweet, userId }).then((response) => res.status(200).json({ message: 'Tweet Posted successfully.', data: response })).catch(err => { res.send('error creating tweet' + err) })
})

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);

    })
})