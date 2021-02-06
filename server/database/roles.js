const mongoose=require("mongoose");

const Schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("Role", Schema)