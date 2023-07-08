import { Router } from "express";
import auth from "../middleware/auth.js";
import { getUserById, updateUser } from "../controllers/user.js";


const router = Router();

// ** 1. get user by ID
router.get('/userById/:userId', auth, getUserById)

// ** 2. update user
router.patch('/updateuser/:email', auth, updateUser)

export default router
