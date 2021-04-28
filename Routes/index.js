const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", function (req, res, next) {
  return res.render("SignUp.ejs");
});

router.post("/signup", function (req, res, next) {
  console.log("Inside Signup Router");
  console.log(req.body);

  const personInfo = req.body;

  if (
    !personInfo.HTNO ||
    !personInfo.username ||
    !personInfo.email ||
    !personInfo.password
  ) {
    res.send();
  } else {
    User.findOne({ email: personInfo.email }, function (err, data) {
      if (!data) {
        var c;
        User.findOne({}, function (err, data) {
          var newPerson = new User({
            HTNO: personInfo.HTNO,
            username: personInfo.username,
            email: personInfo.email,
            password: personInfo.password,
          });

          newPerson.save(function (err, Person) {
            if (err) console.log(err);
            else console.log("Success");
          });
        })
          .sort({ _id: -1 })
          .limit(1);
        res.send({ Success: "You are regestered,You can login now." });
      } else {
        res.send({ Success: "Email is already used." });
      }
    });
  }
});

router.get("/", function (req, res, next) {
  return res.render("SignIn.ejs");
});

router.post("/", function (req, res, next) {
  console.log("HIIIIIII");
  console.log(req.body);
  User.findOne({esignupmail:req.body.email},function(err,data){
    if(data){
        
        if(data.password==req.body.password){
            //console.log("Done Login");
            req.session.userID = data.HTNO;
            //console.log(req.session.userId);
            res.send({"Success":"Success!"});
        }else{
            res.send({"Success":"Wrong password!"});
        }
    }else{
        res.send({"Success":"This Email Is not registered!"});
    }
});
});

router.get('/rooms', function (req, res, next) {
	console.log("Inside Rooms get");
	User.findOne({HTNO:req.session.userID},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('Rooms.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get("/createroom", function (req, res, next) {
  return res.render("newroom.ejs");
});

module.exports = router;
