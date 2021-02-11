const express=require('express')
const bcrypt=require('bcryptjs');
const router=express.Router()

const Users=require('../middleware/middleware')
const Auth=require('../middleware/auth')

router.post('/login' ,Users.postLogin)

//testing verification of a token
router.get('/verify', Auth.verifyToken, Auth.findUser);



module.exports=router;