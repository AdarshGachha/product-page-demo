const express = require('express');
const passport = require('passport');
var router = express.Router();

// userModel file require in user.js
const userModel = require("./users.js")
const productModel = require("./product.js")


// userModel 

// SCREENSHOT Accesing passport local 
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/createproduct',isLoggedIn, function (req, res, next) {
  userModel.findOne({username: req.session.passport.user})
  .then(function(user){

    productModel.create({
      userid: user._id,
      name:req.body.name,
      price:req.body.price

    }).then(function(pr){

      user.products.push(pr._id);
      user.save()
      .then(function(){
        res.redirect("back")
      })

    })

  })


});

router.get('/login', function (req, res, next) {
  res.render('login');
});


router.get('/profile',isLoggedIn ,function (req, res, next) {

  userModel.findOne({username:req.session.passport.user})
  .then(function(user){


    res.render("profile",{user})
  })

});


router.get('/allusers',isLoggedIn ,function (req, res, next) {
  userModel.findOne({username:req.session.passport.user})
  .then(function(loggedinuser){
    userModel.find()
    .then(function(allusers){
  
      res.render('allusers',{allusers,loggedinuser});
    })
  
  })
  
  });


  router.get('/products',isLoggedIn ,function (req, res, next) {
    userModel.findOne({username:req.session.passport.user})
    .then(function(user){
      
      productModel.find()
      .populate("userid")
      .then(function(products){
  console.log("here is new data "+req.user);

        res.render("products",{products, user})
      })
    })

    });
    router.get('/cart',isLoggedIn ,function (req, res, next) {
      userModel.findOne({username:req.session.passport.user})
      .populate({
        path:"cart",
        populate:{
          path:"userid"
        }
      })
      .then(function(user){
        res.render("cart",{user})
      })
  
      });

    router.get('/cart/:id',isLoggedIn ,function (req, res, next) {
      userModel.findOne({username:req.session.passport.user})
      .then(function(loggedinuser){
        loggedinuser.cart.push(req.params.id)
        loggedinuser.save().then(function(){
          res.redirect("back");
        })

      })
  
      });


      router.get('/remove/cart/:id',isLoggedIn ,function (req, res, next) {
        userModel.findOne({username:req.session.passport.user})
        .then(function(loggedinuser){
          var index = loggedinuser.cart.indexOf(req.params.id)
          loggedinuser.cart.splice(index,1);
          loggedinuser.save().then(function(){
            res.redirect("back");
          })
  
        })
    
        });

        


router.post('/register', function (req, res, next) {
  var newUser = new userModel({
    username : req.body.username,
    email : req.body.email,
    photo:req.body.photo
  })
  userModel.register(newUser, req.body.password)
  .then(function(createdUser){
    passport.authenticate('local')(req,res, function(){
      res.redirect("/profile")
    })
  });
  // .catch(function(e){
  //   res.send(e);
  // })

});

router.post("/login", passport.authenticate('local',{
successRedirect:"/profile",
failureRedirect:"/login"

}),function (req,res){
  
});

router.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });


});

router.get("/friend/:id",isLoggedIn,function(req,res){
  userModel.findOne({username: req.session.passport.user})
  .then(function(loggedinuser){
    userModel.findOne({_id:req.params.id})
    .then(function(Jisko_friend_banana_hai){
      loggedinuser.friends.push(Jisko_friend_banana_hai._id);
      Jisko_friend_banana_hai.friends.push(loggedinuser._id);

      Jisko_friend_banana_hai.save()
      .then(function(){
        loggedinuser.save().then(function(){
          res.redirect("back")
        })
      })
    })

  })
})


// DELETE THE user id WHICH CREATED


router.get("/delete",isLoggedIn,function(req,res){
  userModel.findOneAndDelete({username:req.session.passport.user})
  .then(function(deleteduser){
    res.redirect("back");

  })
  
})



// DELETE THE PRODUCT WHICH CREATED


router.get("/deleteproduct/:id",isLoggedIn,async function(req,res){
 const user = await userModel.findOne({username:req.session.passport.user})
await productModel.findOneAndDelete({_id:req.params.id})


  res.redirect("back")
  
  
})

router.get("/edit/:id",isLoggedIn,function(req,res){
  userModel.findOne({_id:req.params.id})
  .then(function(user){
    res.render("edit",{user});

  })
  
})


router.get("/edit/:id",isLoggedIn,function(req,res){
  productModel.findOne({_id:req.params.id})
  .then(function(product){
    res.render("edit",{product});

  })
  
})  


router.post("/update/:id",isLoggedIn,function(req,res){
  userModel.findOneAndUpdate({username:req.session.passport.user},{username:req.body.username, photo:req.body.photo})
  .then(function(){
    res.redirect("/allusers");

  })
  
})

// router.post("/products/update/:id",isLoggedIn,function(req,res){
//   productModel.findOneAndUpdate({username:req.session.passport.user},{name:req.body.name, price:req.body.price})
//   .then(function(){
//     res.redirect("/profile");

//   })
  
// })

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect("/login");
  }
}




module.exports = router;
