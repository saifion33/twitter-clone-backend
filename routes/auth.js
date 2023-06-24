import express from 'express';
import { login, signup } from '../controllers/auth.js';

const router = express.Router();

// ** 1. signup
router.post('/signup', signup)

// ** 2. login
router.get('/login/:email/:id', login)

export default router