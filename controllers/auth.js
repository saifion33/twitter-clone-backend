import User from '../models/user.js';
import jwt from 'jsonwebtoken'

// ** 1. *********************************** SIGNUP ********************************
export const signup = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ email: req.body.email, id: req.body.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    if (user) {
        return res.status(200).json({ message: 'User already exists.', data: { user, token } })
    }
    User.create(req.body).then((response) => res.status(200).json({ message: 'user created successfully.', data: { user: response, token } })).catch(err => { res.send('error creating user' + err) })
}

// ** 2. *********************************** LOGIN ********************************
export const login = async (req, res) => {
    const email = req.params.email;
    const id = req.params.id;
    try {
        const user = await User.findOne({ email })
        if (user) {
            // eslint-disable-next-line no-undef
            const token = jwt.sign({ email, id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            return res.status(200).json({ message: 'user found successfully', data: { user, token } })
        }
        res.status(404).json({ message: 'user not found', data: null })
    } catch (error) {
        res.status(500).json({ message: 'Somthing goes wrong', data: null })
    }
}

export const isUserExist = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).send(true)
        }
        res.status(200).send(false);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', data: null });
    }
}

