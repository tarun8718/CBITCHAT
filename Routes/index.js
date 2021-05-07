const express = require("express");
const socketio = require('socket.io');
const router = express.Router();
const User = require("../models/user");
const newRoom = require("../models/newRoom");

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
  User.findOne({ email: req.body.username }, function (err, data) {
    if (data) {
      if (data.password == req.body.password) {
        //console.log("Done Login");
        req.session.userID = data.HTNO;
        //console.log(req.session.userId);
        res.send({ Success: "Success!" });
      } else {
        console.log(req.body.password);
        console.log(data);
        res.send({ Success: "Wrong password!" });
      }
    } else {
      res.send({ Success: "This Email Is not registered!" });
    }
  });
});

router.get("/rooms", function (req, res, next) {
  console.log("Inside Rooms get");
  console.log("Inside Rooms get 123");
  console.log(req.data);
  User.findOne({ HTNO: req.session.userID }, function (err, data) {
    console.log("data");
    console.log(data);
    if (!data) {
      res.redirect("/");
    } else {
      //console.log("found");
      return res.render("Rooms.ejs", {
        name: data.username,
        email: data.email,
      });
    }
  });
});

router.post("/rooms", function (req, res, next) {
  console.log("Inside Rooms POST");
  console.log(req.body);
  User.findOne({ HTNO: req.session.userID }, function (err, data) {
    console.log("data");
    console.log(data);
    if (!data) {
      res.redirect("/");
    } else {
      console.log("*******found");
      console.log(req.body);
      newRoom.findOne({ roomname: req.body.room }, function (err, dat) {
        if (dat) {
          if (dat.password == req.body.password) {
            req.session.room = req.body.room;
            req.session.name = data.username;
            res.send({ Success: "Success!" });
          } else {
            console.log(req.body.password);
            console.log(dat);
            res.send({ Success: "Wrong KEY!" });
          }
        } else {
          res.send({ Success: "This Room Is not registered!" });
        }
      });
    }
  });
});

router.get("/createroom", function (req, res, next) {
  return res.render("newroom.ejs");
});

router.post("/createroom", function (req, res, next) {
  console.log("Inside createroom Router");
  console.log(req.body);

  const roomdata = req.body;

  if (roomdata.password === "") {
    console.log("Inside create room if");
    newRoom.findOne({ roomname: roomdata.roomname }, function (err, data) {
      if (!data) {
        var c;
        newRoom
          .findOne({}, function (err, data) {
            var newtemp = new newRoom({
              status: "Public",
              roomname: roomdata.roomname,
            });
            newtemp.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
          .sort({ _id: -1 })
          .limit(1);
        res.send({ Success: "New room built." });
      } else {
        res.send({ Success: "Room with that name already exists." });
      }
    });
  } else {
    console.log("Inside create room else");
    newRoom.findOne({ roomname: roomdata.roomname }, function (err, data) {
      if (!data) {
        var c;
        newRoom
          .findOne({}, function (err, data) {
            var newtemp = new newRoom({
              status: "Private",
              roomname: roomdata.roomname,
              password: roomdata.password,
            });

            newtemp.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
          .sort({ _id: -1 })
          .limit(1);
        res.send({ Success: "New room built." });
      } else {
        res.send({ Success: "Room with that name already exists." });
      }
    });
  }
});

router.get("/chat", function (req, res, next) {
  console.log("Inside Chat Get");
  console.log("data =");
  console.log(req.body);
  console.log("session.userID");
  console.log(req.session.userID);
  console.log(req.session.room);
  console.log(req.session.name);
  username = req.session.name;
  room = req.session.room;
  return res.render("chat.ejs",{room: req.session.room, username: req.session.name});
});


module.exports = router;
