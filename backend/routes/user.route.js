import express from 'express';
import { loginUser, signupUser, googleSignup } from '../controller/user.controller.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/google-signup', googleSignup);

export default router;