const express = require('express');
const app = express();

// Extra mongoose setup???
const bodyParser = require('body-parser');

// Importing our models
const models = require('../models');
const Doc = models.Doc;
const User = models.User;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');


//allows us to use req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//..allows you to parse through cookie strings...may not be useful
app.use(cookieParser());
//looks up static files to use. It's in the public director, but that name may
//need to be changed ****
app.use(session({
  secret: 'bippity boppity boo',
  maxAge: 1000*60*2
}));


// PASSPORT SETUP
//serializeUser determines, which data of the user object should be stored in the session.
//it only stores the user id to be used by deserializeUser thereafter
// serializeUser method is attached to the session as req.session.passport.user = {id:'..'}
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

//In deserializeUser the user id key is matched with the in memory array / database or any data resource.
//done function atttaches the user object to the request as req.user that will be used later
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// LocalStrategy-check if username is valid
passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    }
    // if no user present, auth failed
    if (!user) {
      console.log(user);
      return done(null, false, { message: 'Incorrect username.' });
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    // auth has has succeeded
    return done(null, user);
  });
}));
//END OF PASSPORT setup

// LINK PASSPORT TO express
app.use(passport.initialize());
app.use(passport.session());

// TODO: edit res.send to res.json +edit .register so it authenticates the user

// Handling a registration request
app.post('/register', function(req, res) {
  console.log('req.body = ', req.body);

  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser.save(function(err, user) {
    if (err) {
      console.log("error", err);
      res.status(500).json({ error: err });
    } else {
      res.json({success:true});
    }
  });
});


//**all router stuff may be unecesarry. Delete if needed
// POST Login page
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.json({success:true});
});

app.post('/register', function(req, res) {
    // validation step
    // if (!validateReq(req)) {
    //   res.render('/register', {
    //     error: "Passwords don't match."
    //   });
    // }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).json({success: true});
        return;
      }
      console.log(user);
      res.json({success:true});
      //NOTE: no res.redirect 'login' if using express router. React router requires redirect
      //to be handled on the front-end. If not using react, we can do res.redirects on the
      //back-end.
    });
});




// Retrieving the list of document upon logging in
app.get('/docsList', function(req, res) {
  var docsArray = [];
  Doc.find({collaborators:req.params.userId})
    .exec()
    .then((documents) => {
      documents.forEach((document) => {
        docsArray.push(document);
      });
      res.json(docsArray);
    });
});

// Creating a new document
app.post('/createDoc', function(req, res) {
  var newDoc = new Doc({
    title: req.body.docName,
    dateCreated: new Date(),
    // With the user id we have to go find their user object in the DB and add them as the owner and and as a collaborator
    collabs: [req.body.userId],
    owner: req.body.userId
  });
  newDoc.save(function(err, user) {
    if (err) {
      console.log("error", err);
    } else {
      res.json({success:true});

    }
  });
});


  // GET Logout page
app.get('/logout', function(req, res) {
  req.logout();
  res.json({success: true});
});


app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});



//makes sure that people can only enter one room at once
//spcket.oneRoom = room


//socket.leave(socket.theOneRoom)
//remember: each server has their own socket
//runs 2 servers at the same time
//do a .on for the user left on the docs front end
//socket is an object, and we are allowed to put our own keys on it
//can't sent functions across the wire. That's why we use stringify
//to convert object to strings
//note: put red into style map
//make serparate socket to manually tell user information about the cursor
//first

//make an auth.js, server.js, and database.js for the back-end
