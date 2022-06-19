const express = require('express')
const path = require('path')
const multer = require('multer')   // handling multipart/form-data , which is primarily used for uploading files
const favicon = require('serve-favicon')
const logger = require('morgan')   //to log HTTP requests and errors
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const db = require('monk')('localhost/NodeBlog')
const flash = require('connect-flash')

const routes = require('./routes/index')
const posts = require('./routes/posts')
const categories = require('./routes/categories')
const bodyParser = require('body-parser')

const app = express()

app.locals.moment = require('moment')
app.locals.truncateText = function(text,length){
    const truncatedText = text.substring(0,length);
    return truncatedText
}

// view engine setup
// jade -> used to server-side rendering, templating engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine','jade')

//handle file uploads and multipart data
const upload = multer({dest: './public/Images/uploads'})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


//Express session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}))

// Validator
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
        const namespace = param.split('.'),root = namespace.shift(),formParam=root

        while(namespace.length){
            formParam += '['+namespace.shift()+']'
        }
        return {
            param:formParam,
            msg:msg,
            value:value
        }
    }
}))

app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))

//connect-flash
app.use(flash())
app.use(function(req,res,next){
    res.locals.message = require('express-messages')(req,res)
    next()
})

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
  });

// error handlers
// production error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
  }

//Express server
const http = require('http');
const server = http.createServer(app);  

app.use('/',routes)
app.use('/posts',posts)
app.use('/categories',categories)

app.get('/', function(req, res) {
    res.send("Hello World!");
});

server.listen(3000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

app.use(function(req,res,next){
    const err = new Error('not found')
    err.status = 404
    next(err)
})

module.exports = app

// 'ckeditor' is used for editing html page online, its WYSIWYG rich editor written in javascript