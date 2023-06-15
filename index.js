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
        console.log('Server not Connected')
        console.log(error.message);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' })
})

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

app.get('/allTweets', async (req, res) => {
    try {
        const tweets = await Tweet.find()
        if (tweets) {
            return res.status(200).json({ message: 'Tweets found', data: tweets })
        }
        res.status(404).json({ message: 'tweets not found', data: null })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
})

app.post('/newUser', async (req, res) => {

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(200).json({ message: 'User already exists.', data: user })
    }
    User.create(req.body).then((response) => res.status(200).json({ message: 'user created successfully.', data: response })).catch(err => { res.send('error creating user' + err) })
})
app.patch('/updateUser', async (req, res) => {
    const { email, update } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate({ email }, update, { new: true })
        if (updatedUser) {
            return res.status(200).json({ message: 'User updated successfully', data: updatedUser })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
})

app.post('/tweet', async (req, res) => {
    const { imageUrl, tweet, user } = req.body;
    Tweet.create({ imageUrl, tweet, user }).then((response) => res.status(200).json({ message: 'Tweet Posted successfully.', data: response })).catch(err => { res.send('error creating tweet' + err) })
})

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    })
})