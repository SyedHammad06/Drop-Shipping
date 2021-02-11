const SignUp=require('../database/signup');
const Roles=require('../database/roles')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const signup = require('../database/signup');

exports.verifyToken=(req, res, next)=>{
    //captures headers with the http names 'x-access-token' OR 'authorization'
        let token=req.headers['x-access-token'] || req.headers['authorization'];
    //removing the word Bearer from the api json string
        if(token.startsWith('Bearer ')){
            token=token.slice(7, token.length)
        }
    //bearers are token carriers which bear the token to be stored and used
    
        if(!token){
            res.send({message:'no token provided'}).status(403);
            return;
        }
    // verifies if the token sent is correct or not
    // if the token isn't correct. there is a breach in security or error in code
        jwt.verify(token, 'gludius-maximus',{ algorithm: 'RS256'}, (err, decoded)=>{
            if(err){
                res.send({message:"Unauthorized, perhaps token might be invalid pr expired"});
                console.log(err)
                return;//due to error pass control to the next handle immediately
            }
            if(!decoded){
                console.log('not decoded')
            }
            req.userId=decoded.id
            console.log(decoded)
            next()
            /* res.json(decoded.id)
            res.status(200).send(decoded+'err');//sends decoded id */
        })
        
    }

exports.findUser=(req, res, next)=>{
    SignUp.findById(req.userId, {password:0}, (err, user)=>{
        if(err){return res.status(500).send({message:'problem in finding a user'})}
        if(!user){return res.status(403).send({message:'user not found'})}
        res.status(200).send(user)
    })
}

