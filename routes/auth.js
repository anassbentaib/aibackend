import express from 'express';
const router = express.Router()
import { login, signup , googleLogin } from '../controllers/auth.js';


router.post('/signup', signup)

router.post('/login', login)

router.post('/google-login', googleLogin)


export default router