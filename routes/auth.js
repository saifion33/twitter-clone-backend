import express from 'express';
import { isUserExist, login, signup } from '../controllers/auth.js';

const router = express.Router();

// ** 1. signup
router.post('/signup', signup)

// ** 2. login
router.get('/login/:email/:id', login)

// ** 3. isUserExists
router.get('/isUserExist/:email', isUserExist)
export default router