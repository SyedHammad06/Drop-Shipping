const SignUp=require('../database/signup');
const Roles=require('../database/roles')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const signup = require('../database/signup');

exports.getUsers=(req, res)=>{
    SignUp.find()
    .then(result=>{
        console.log(result);
        res.json(result)
        console.log(result.length+' users signed in');
    })
    .catch(err=>console.log(err));
}

exports.PostUsers=async (req, res)=>{
    try{
        const salt=await bcrypt.genSaltSync(10)
        const hashedPassword=await bcrypt.hash(req.body.password, salt);
        const user=new SignUp({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            gender:req.body.gender
        })
        const newUser= await user.save()
        console.log(newUser)
    }catch(err){
        res.status(500).send(err)
        console.log(err+'err');
    }
}

exports.checkEmail=async(req, res, next)=>{
    try{
        await SignUp.findOne({email:req.body.email}).exec((err, user)=>{
            if(err){
                res.status(500).err({message:err})
                return;
            }
            if(user){
                res.status(400).send({message:"email is already in use please try another one"})
                return;
            }
            next();
        })
    }catch(err){
        res.status(500).send(err)
    }
}

exports.findById=(req, res, next)=>{
    SignUp.findById(req.params.id)
    .then(user=>{
        console.log('working');
        if(user==null)return res.json({message:"cant find user"})
        res.user=user;
        next();
    })
    .catch(err=>console.log(err));
}


exports.getLogin=async(req, res)=>{
    res.setHeader("Content-Type", "text/html");
    try{
        await SignUp.findOne({email:req.body.email}).exec((err, user)=>{
            if(err){res.status(500).send({message:err})}
            const passwordIsValid=bcrypt.compareSync(req.body.password, user.password)
            if(!passwordIsValid){
                res.send({
                    accessToken:null,
                    message:"Invalid Password"
                })
                return;
            }
            if(!user){res.status(404).send({message:'user not found'})}
            const token=jwt.sign({id:user.id}, 'gludius-maxiums', {expiresIn:'1h'})//gludius-maximus is a, secret-refer documentation of jwt
            res.status(200).send({
                name:user.name,
                email:user.email,
                accessToken:token
            })
        })
    }catch(err){
        console.log(err)
        res.send(err)
    }
}

exports.verifyToken=(req, res, next)=>{
    let token=req.headers['x-access-token'];

    if(!token){
        res.send({message:'no token provided'}).status(403);
    }

    jwt.verify(token, 'gludius-maximus', (err, decoded)=>{
        if(err){
            res.send({message:"Unauthorized"});
            return;
        }
        req.userId=decoded.id
        next();
    })
}

exports.isBuyer=(req, res)=>{
    SignUp.findById(req.userId).exec((err, user)=>{
        if(err){
            res.status(500).send({message:err})
            return;
        }
        Roles.find({
            _id:{$in:user.roles}
        })
    })
}

exports.isSeller=(req, res)=>{

}