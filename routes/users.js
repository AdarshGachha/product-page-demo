const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

require("dotenv").config();


mongoose.connect(process.env['MONGO_URI'])
var userSchema = mongoose.Schema ({
  username:String,
  email:String,
  password:String,
  photo:String,
  cart:[{type:mongoose.Schema.Types.ObjectId,ref:"product"}],
  products:[{type: mongoose.Schema.Types.ObjectId, ref:"product"}],

  friends:{
    type : Array,
    default:[]

  }
  
})

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);
