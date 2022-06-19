const express = require('express')
const mongo = require('mongodb')
const db = require('monk')('localhost/NodeBlog')
const router  =express.Router()

router.get('/show/:category',function(req, res, next){
    const db = req.db;
    const posts = db.get(posts)
    posts.find({category:req.params.category},{},function(err,posts){
        res.render('index',{
            "title":req.params.category,
            "posts":posts
        })

    })

})

router.get('/add',function(req,res,next){
    res.render('addcategory',{
        "title":"Add Category"
    })
})

router.post('/add',function(req,res,next){

    // get form values
    const title = req.body.title
  
    // form validation
    req.checkBody('title','title is required').notEmpty()

    //check errors
    const errors = req.validationErrors()

    if(errors){
        res.render('addcategory',{
            "errors":errors,
            "title":title,
        })
    }
    else{
        const categories = db.get('categories')

        //submit to db
        categories.insert({
            "title":title,
            "category":category,
        },function(err,category){
            if(err){
                res.send('There was an issue submitting the category')
            }else{
                req.flash('success','Category submitted')
                res.location('/')
                res.redirect('/')
            }
        })
        
    }
})

module.exports = router