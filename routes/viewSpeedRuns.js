/*
This router exists to look at previous speed runs without
submitting a new once
*/
const express = require('express');
const router = express.Router();
const SpeedRun = require('../models/SpeedRun')

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const game = req.body.game
      const category = req.body.category
      res.locals.game = game
      res.locals.category = category
      res.locals.times = await SpeedRun.find({"$and": [
        {game:game},
        {category:category}
      ]})
      res.render('viewSpeedRuns');
});

router.get('/',
    (req, res) =>{
      res.render('viewAllSpeedRuns')
    })


module.exports = router;
