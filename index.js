/* eslint-disable no-undef */
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import tweetRoutes from './routes/tweet.js'
import userRoutes from './routes/user.js'
dotenv.config()

const app = express()

app.use(cors({origin:'http://localhost:5173'}))
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

app.use('/auth', authRoutes)

app.use('/tweet', tweetRoutes)

app.use('/user', userRoutes)

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    })
})
