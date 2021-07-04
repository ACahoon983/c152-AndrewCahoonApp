/*
newRun.js router for submitting a new speedrun
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

/* post a new run */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
        const game = req.body.game
        const category = req.body.category
        const hours = req.body.hours
        const minutes = req.body.minutes
        const seconds = req.body.seconds
        const milliseconds = req.body.milliseconds
        const username = req.body.username
      const newRun = new SpeedRun(
        {game:game,
         category:category,
         hours:hours,
         minutes:minutes,
         seconds:seconds,
         milliseconds:milliseconds,
         createdAt: new Date(),
         userId: req.user._id,
         username:username,
        })
        res.locals.game = game
        res.locals.category = category
      await newRun.save();
      res.redirect('/mySpeedRuns')
});
/*Delete a previous run*/
router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /newRun/remove/:itemId")
      await SpeedRun.remove({_id:req.params.itemId});
      res.redirect('/mySpeedRuns')
});

router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.render('newSpeedRun');
});

module.exports = router;
