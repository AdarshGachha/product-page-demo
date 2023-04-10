const mongoose = require("mongoose");


var productSchema = mongoose.Schema ({
  userid:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
  name:String,
  price:String
  
})


module.exports = mongoose.model("product",productSchema);
