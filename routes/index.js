var express = require("express");
const passport = require("passport");
var router = express.Router();
var userModel = require("./users");
var mailModel = require("./mails");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", function (req, res, next) {
  const newUser = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });
  userModel.register(newUser, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/login");
    });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res, next) {}
);

// router.get("/profile", async function(req, res, next) {
//   var userData = await userModel.findOne({username:req.user.username})
//   var newMail = await mailModel.find()
//   .populate()
//   console.log(newMail);
//   // console.log(userData);
//   res.render('profile', {userData , newMail})
// });


// router.post("/compose",  (req, res) => {
//   userModel.findOne({ username: req.user.username })
//   .then((loggedInUser)=> {
//     console.log(loggedInUser);
//       mailModel.create({
//       sendingto: req.body.sendingto,
//       mailtext: req.body.mailtext,
//       user: loggedInUser._id
//     })
//     .then((createdMail)=>{
//       console.log(createdMail);
//       loggedInUser.mail.push(createdMail._id)
//       loggedInUser.save()
//       .then(()=>{

  //         res.redirect("/profile")
//       })
//     })


//   });
// });
  router.get("/profile", isLoggedIn, async (req, res) => {
    const userData = await userModel.findOne({ username: req.user.username });
    const mailData = await mailModel.find().populate('user')

    res.render("profile" , {userData , mailData})
  });

router.post("/compose", async (req, res) => {
  const loggedInUser = await userModel.findOne({username:req.user.username})
  const newMail = await mailModel.create({
    
    sendingto:req.body.sendingto,
    mailtext:req.body.mailtext,
    user:loggedInUser._id
  })
  console.log(newMail)
  loggedInUser.mail.push(newMail._id)
  loggedInUser.save()
  res.redirect("/profile")
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}




//oauth

const GOOGLE_CLIENT_ID =
  "184644567601-712m204ljidhmliomk42a9deq45h7i4k.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const findOrCreate = require("mongoose-findorcreate");

var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      userModel.findOrCreate({ email: profile.email , username:profile.displayName}, function (err, user) {
        console.log(user);
        return done(err, user);
      });
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);









module.exports = router;
