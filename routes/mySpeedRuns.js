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
        {userId:req.user._id},
        {game:game},
        {category:category}
      ]})
      res.render('mySpeedRuns');
});

router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      console.log("inside /mySpeedRuns/remove/:itemId")
      await SpeedRun.remove({_id:req.params.itemId});
      res.redirect('/mySpeedRuns')
});

router.get('/',
  isLoggedIn,
  async(req,res,next) => {
    res.render('viewMySpeedRuns')
  })

module.exports = router;
