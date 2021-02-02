const SignUp=require('../database/signup');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

exports.getUsers=(req, res)=>{
    SignUp.find()
    .then(result=>{
        console.log(result);
        res.json(result)
        console.log(result.length+' users signed in');
    })
    .catch(err=>console.log(err));
}

exports.postLogin=(req, res)=>{
    
}

exports.PostUsers=async (req, res)=>{
    try{
        const salt=await bcrypt.genSaltSync(10)
        const hashedPassword=await bcrypt.hash(req.body.password, salt);
        const user=new SignUp({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
            year:req.body.year,
            month:req.body.month,
            day:req.body.day,
            gender:req.body.gender
        })
        const newUser=await user.save()
        console.log(newUser)
    }catch(err){
        res.status(500).send(err)
        console.log(err+'err');
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

exports.verifyToken = (req, res, next) => {
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1];
    if (!token) {
    return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
    });
};//using later