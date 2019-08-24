var express = require('express');
var router = express.Router();
var Post = require('../../model/post');
var CheckAuth = require('../middleware/check-auth');

router.get('/list', CheckAuth, function(req,res){
  Post.find({}).populate('author').exec(function(err, rtn){
    console.log(rtn);
    if(err){
      res.status(500).json({
        message:'Server Error',
        err: err
      })
    }
    else
    {
      if( rtn == null){
      res.status(204).json({
        message:'No Content data found'
      })
    }
    else {
      res.status(200).json({
        posts : rtn
      })
    }
   }
  });
});

 router.get('/detail/:id', CheckAuth, function(req,res){
   Post.find({}).populate('author').exec(function(err, rtn){
     if(err){
       res.status(500).json({
         message:'Server Error',
         error:err
       })
     }
     else
     {
       if( rtn == null){
       res.status(204).json({
         message:'No Content data found'
       })
     }
     else {
       res.status(200).json({
         users:rtn
       })
     }
    }
  });
});
router.delete('/:id',CheckAuth, function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err, rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }
    res.status(200).json({
      message:'Post Deleted'
    })
  })
});
router.post('/add', function (req, res){//For post
  var post = new Post();
  console.log(req.body);
  post.title = req.body.title;
  post.content = req.body.content;
  post.author = req.body.author;
  post.save(function (err, rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }
    else {
      res.status(201).json({
        message:'Server Error',
        rtn:rtn
      })
    }
  })
})

router.patch('/:id',CheckAuth, function(req, res){//for Update
  var updateOps = {}
  for(var ops of req.body){
    updateOps[ops.proName ] = (ops.proName != 'password')? ops.value:bcrypt.hasSync(ops.value, bcrypt.genSaltSync(8), null);
  }
  Post.findByIdAndUpdate(req.params.id, {$set: updateOps}, function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }
    else {
      res.status(200).json({
        message:'Post Account Modified'
      })
    }
  })
})
module.exports = router;
