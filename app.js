const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const axios = require("axios");
const layouts = require("express-ejs-layouts");
const dotenv = require('dotenv').config()
const Walk = require('./models/Walk')
//const auth = require('./config/auth.js');


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/finalApp');
//mongoose.connect( 'mongodb://localhost/finalApp');
 {useNewUrlParser: true}
 const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const newRunRouter = require('./routes/newSpeedRun');
const mySpeedRunsRouter = require('./routes/mySpeedRuns')
const viewSpeedRunsRouter = require('./routes/viewSpeedRuns')



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mySpeedRuns',mySpeedRunsRouter);
app.use('/submitRun',newRunRouter);
app.use('/viewSpeedRuns',viewSpeedRunsRouter);

app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id:userId})
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/userId:")
        next(e)
      }
    }
)
app.get('/authorProfile',
    (req,res) =>{
      res.render('authorProfile')
})


app.get('/profile',
    isLoggedIn,
    (req,res) => {
      res.render('profile')
  })

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

    })

app.get('/authorProfile',
    (req, res) => {
      res.render('authorProfile')
    })

app.get('/walk',
    async(req,res,next) => {
      res.locals.walk = await Walk.find({userId:req.user._id})
      res.render('walkingLog')
})

app.post('/logWalk',
    async(req,res,next) =>{
      const date = req.body.date
      const minutes = req.body.minutes
      const steps = req.body.steps
      const a = parseFloat(steps)
      const b = parseFloat(minutes)
      const speed = a/b
      const walk = new Walk(
        {date:date,
         minutes:minutes,
         steps:steps,
         speed:speed,
         createdAt: new Date(),
         userId: req.user._id,
        })
      res.locals.walk = await Walk.find({userId:req.user._id})
    await walk.save();
    res.render('walkingLog')
})

app.get('/gameSearch',
    (req,res) => {
      res.render('gameSearch')
    })

app.post('/findGame',
    async(req,res,next) =>{
      try{
        const game = req.body.game
        const url = "https://www.speedrun.com/api/v1/games?name="+game+"&p=1"
        const result = await axios.get(url)
        console.dir(result.data)
        console.log('results')
        console.dir(result.data)
        res.locals.data = result.data
        //res.json(result.data)
        res.render('findGame')
      } catch(error){
      next(error)
    }
})

app.use('/data',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
