const express = require('express')
const mongo = require('mongodb')
const db = require('monk')('localhost/NodeBlog')
const router = express.Router();

//Homepage blog posts
router.get('/',function(req,res,next){
    const db = req.db
    const posts = db.get('posts')
    posts.find({},{},function(err,posts){
        res.render('index',{"posts":posts})
    })
})
module.exports = router