const express = require('express')
const mongo = require('mongodb')
const db = require('monk')('localhost/NodeBlog')
const router  =express.Router()

router.get('/show/:id',function(req, res, next){
    const posts = db.get('posts')
    posts.findById(req.params.id,function(err,post){
        res.render('show',{
            "post":post 
        })
    })
})

router.get('/add',function(req,res,next){
    const categories = db.get('categories')
    categories.find({},{},function(err,categories){
        res.render('addpost',{
            "title":"Add Post",
            "categories":categories
        })
    }) 
})

router.post('/add',function(req,res,next){

    // get form values
    const title = req.body.title
    const category  = req.body.category
    const body = req.body.body
    const author = req.body.author
    const date = new Date()

    if(req.files.mainimage){
        const mainImageOriginalName = req.files.mainimage.originalname 
        const mainImageName = req.files.mainimage.name 
        const mainImageMime = req.files.mainimage.mimetype
        const mainImagePath = req.files.mainimage.path
        const mainImageExt = req.files.mainimage.extension
        const mainImageSize = req.files.mainimage.size
    }
    else{
        const mainImageName = 'noimage.png'
    }

    // form validation
    req.checkBody('title','title is required').notEmpty()
    req.checkBody('body','body is required')

    //check errors
    const errors = req.validationErrors()

    if(errors){
        res.render('addpost',{
            "errors":errors,
            "title":title,
            "body":body
        })
    }
    else{
        const posts = db.get('posts')

        //submit to db
        posts.insert({
            "title":title,
            "body":body,
            "category":category,
            "date":date,
            "author":author,
            "mainimage":mainImageName
        },function(err,post){
            if(err){
                res.send('There was an issue submitting the post')
            }else{
                req.flash('success','Post submitted')
                res.location('/')
                res.redirect('/')
            }
        })
        
    }
})

router.post('/addcomment',function(req,res,next){

    // get form values
    const name = req.body.name
    const email  = req.body.email
    const body = req.body.body
    const postid = req.body.postid
    const date = new Date()

    // form validation
    req.checkBody('name','Name is required').notEmpty()
    req.checkBody('email','Email is required').notEmpty()
    req.checkBody('email','Email is not correctly formatted').isEmail()
    req.checkBody('body','Body field is required').notEmpty()

    //check errors
    const errors = req.validationErrors()

    if(errors){
        const posts = db.get('posts')
        posts.findById(postid,function(err,post){
            res.render('show',{
                "errors":errors,
                "post":post,
            })
        })
        
    }
    else{
        const comment = {"name":name, "email":email,"body":body,"commentdate":commentdate}

        const posts = db.get('posts')

        //submit to db
        posts.update({
            "_id":postid
        },
        {
            $push:{
                "comments":comment
            }
        },function(err,doc){
            if(err){
                throw err
            }else{
                req.flash('success','Comment Added')
                res.location('/posts/show/'+postid)
                res.redirect('/posts/show/'+postid)
            }
        })
        
    }
})
module.exports = router