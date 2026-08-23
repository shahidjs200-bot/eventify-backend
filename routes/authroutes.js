import express from 'express';
import {registerUser , loginUser, genrateToken} from '../controller/authcontroller.js'
import {body} from 'express-validator';
import passport from '../config/passport.js';
import { protect } from './../middleware/authmiddleware.js';

const router = express.Router();
router.post('/register',
    [body('email').isEmail().withMessage('please enter valid email'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 character')]
    ,registerUser);
    
router.post('/login',
    [body('email').isEmail().withMessage('please enter valid email'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 character')]
    ,loginUser);

router.get('/google',(req,res,next)=>{
    console.log('google login start');
    next();
},
    passport.authenticate('google',{scope:['profile','email'],prompt: "select_account",})
);    

router.get('/google/callback',
    passport.authenticate('google',{failureRedirect: "/login",session:false,}),
    async (req,res)=>{
        console.log("✅ Google login success");
        console.log("User:", req.user);
        const token = genrateToken(res,req.user._id);
        res.redirect(`${process.env.CLIENT_URL}/`);
    }
);

router.get('/me',protect, (req,res) => {
    res.json(req.user);
});

router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
  });

  res.json({ message: "Logged out" });
});

export default router;