var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/images/uploads'});
var bcrypt = require('bcrypt');
var User = require('../../model/user');
var CheckAuth = require('../middleware/check-auth');

router.get('/', function(req,res){
  res.status(201).json({
    message:'Home Page'
  });
});


router.get('/list',CheckAuth, function(req,res){
  User.find({}, function(err, rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        err: err
      })
    }
    console.log(rtn);
    if(rtn.lenght< 1){
      res.status(204).json({
        message:'No data found'
      })
    }
    else {
      res.status(200).json({
        users:rtn
      });
    }
  });
});

router.get('/detail/:id',CheckAuth, function(req,res){
  User.findById(req.params.id, function(err, rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      });
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

  })
})
router.delete('/:id',CheckAuth, function(req, res){
  User.findByIdAndRemove(req.params.id, function(err, rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }
    res.status(200).json({
      message:'Post Deleted'
    });
  });
});

router.post('/add',CheckAuth, upload.single('photo'), function (req, res){//For post
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  if(req.file) user.imgUrl = '/images/uploads/' + req.file.filename;
  User.findOne( {email:req.body.email}, function(err2, rtn2) {
    if(err2){
      res.status(500).json({
        message:'Server error',
        err:err2
      })
    }
    else{
      if(rtn2 == null){
        user.save(function(err,rtn){
          if(err2){
            res.status(500).json({
              message:'Server Error',
              err:err
            })
          }
            else {
              res.status(200).json({
                message:'User Account Created'
              })
            }
        })
      }
        else {
          res.status(409).json({
            message:'Already exist'
          })
        }
      }
  } )
})

router.patch('/:id',CheckAuth, function(req, res){//for Update
  var updateOps = {}
  for(var ops of req.body){
    updateOps[ops.proName ] = (ops.proName != 'password')? ops.value:bcrypt.hasSync(ops.value, bcrypt.genSaltSync(8), null);
  }
  User.findByIdAndUpdate(req.params.id, {$set: updateOps}, function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error',
        error:err
      })
    }
    else {
      res.status(200).json({
        message:'User Account Modified'
      })
    }
  })
})

module.exports = router;
