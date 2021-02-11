const express=require('express')
const passport=require('passport')
const bodyParser = require('body-parser')
const session=require('express-session')
const MongoStore=require('connect-mongodb-session')(session)
const mongoose=require('mongoose')
const cors=require('cors');
const csurf=require('csurf');
const mongoUri="mongodb://localhost/projects"

const port=process.env.PORT || 8080

const app = express();

const auth=require('./routes/routes')
const crud=require('./routes/crud')

const Role=require('./database/roles')

/* const store=new MongoStore({
    uri:mongoUri,
    collections:'mongo-sessions'
})

store.on('error', err=>console.log(err)) */

//connecting to database
mongoose.connect(mongoUri,{
    useUnifiedTopology:true, 
    useNewUrlParser:true,
    useCreateIndex:true,
})
.then(()=>{
    console.log('connected to database');
    initial();
})
.catch(err=>{
    console.log("connection error : "+err)
    return;
})
const db=mongoose.connection;
db.on('err', err=>console.log(err))
db.on('open', ()=>{console.log('connected to database')})

app.use(cors())

app.use(bodyParser.urlencoded({extended:true}))//returns urlencoded middleware, and checks for content-type rest-api requests
app.use(bodyParser.json())
app.use('/auth', auth);
app.use('/', crud);
//adding roles to a logged in user
function initial(){
    Role.estimatedDocumentCount((err, count)=>{
        if( !err && count === 0){
            new Role({name:'buyer'})
            .save(err=>{
                if(err){console.log('error :' + error)}
                console.log("added 'buyer' to roles collection")
            })

            new Role({name:'seller'})
            .save(err=>{
                if(err){console.log('error :' + error)}
                console.log("added 'seller' to roles collection")
            })
        }
    })
}

app.listen(port, ()=>{
    console.log('connected to port '+port);
})