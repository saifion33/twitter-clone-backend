import { Router } from "express";
import auth from "../middleware/auth.js";
import { getUserByEmail, updateUser } from "../controllers/user.js";


const router = Router();

// ** 1. get user by email
router.get('/userbyemail/:email', auth, getUserByEmail)

// ** 2. update user
router.patch('/updateuser/:email', auth, updateUser)

export default router
