const express=require('express')
const bcrypt=require('bcryptjs');
const router=express.Router()

const Users=require('../middleware/middleware')

router.get('/', Users.getUsers);

router.post('/signup', Users.PostUsers);

router.get('/:id', Users.findById, (req, res)=>{
    res.json(res.user);
    console.log(res.user)
})
//updating user info
router.patch('/:id', Users.findById, async (req, res)=>{
    if(req.body.name!==null){
        res.user.name=req.body.name
    }
    if(req.body.email!==null){
        res.user.email=req.body.email
    }
    if(req.body.password!==null){
        hashedPassword=req.body.password
    }
    try{
        const user=await res.user.save()
        res.json(user)
    }catch(err){
        res.status(500).send(err)
    }
})

router.delete('/:id', Users.findById, (req, res)=>{
    res.user.remove()
    .then(()=>{
        console.log('deleted a user')
        res.json({message:'deleted a user'})
    })
    .catch(err=>console.log(err));
})

router.post('/login' ,Users.getLogin)


module.exports=router;