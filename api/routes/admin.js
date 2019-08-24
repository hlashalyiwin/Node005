var express = require('express');
var router = express.Router();
var Admin = require('../../model/admin');
var jwt = require('jsonwebtoken');

router.post('/signup', function(req, res){
  var admin = new Admin();
  admin.name =  req.body.name;
  admin.email = req.body.email;
  admin.password = req.body.password;
  Admin.findOne({email:req.body.email}, function(err2, rtn2){
    if(err2){
      res.status(500).json({
        message:'Server Error',
        error:err2
      });
    }
    else {
      if(rtn2 == null){
        admin.save(function(err, rtn){
          if (err) {
            res.status(500).json({
              message:'Server Error',
              error:err
            });
          }
          else {
            res.status(201).json({
              message:'Admin Account Created'
            })
          }
        })
      }
      else {
        res.status(409).json({
          message:'Email is Already exist ! '
        })
      }
    }
  });
});

router.post('/signin', function(req,res){
  Admin.findOne({email:req.body.email}, function(err,rtn){
    if(err){
      res.status(500).json({
        message:'Server Error'
      })
    }
    else {
      if(rtn != null & Admin.compare(req.body.password,rtn.password)){
        const token = jwt.sign({
          email: rtn.email,
          adminId:rtn._id
        },
        "techapi005",
        {
          expiresIn:"2h"
        }
      );
        res.status(200).json({
          message:'Login Successful',
          rtn:rtn,
          token:token
        })
      }
      else {
        res.status(204).json({
          message:'Data Not Found'
        })
      }
    }
  })
})
module.exports = router;
