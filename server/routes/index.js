const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

// login route
router.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
  })
);

// callback route
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });    
    console.log({ user: req.user, token });
    res.cookie('x-auth-token', token);        // client side should store this token in local storage and remove cookie
    res.redirect('http://localhost:3000/');   // change this to the frontend URL
  }
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/protected', passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json(req.user);
});

router.get('/errtest' , (req, res, next) => {
  console.log(abc);
});

module.exports = router;
