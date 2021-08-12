var express= require('express');
var router= express.Router();
const passport = require('passport');
var UserInfoController =require('../controllers/Userinfo.controller');

//@type post
//@route /login
//@desc route for taking user info when he logins first time
//@access private



router.post('/userinfo', passport.authenticate("jwt",{session: false}), async(req,res)=>{
        try{
            await UserInfoController.saveData(req,res);
    }catch(err){
        
        return res.status(500).json({msg: err})
    }
})


module.exports=router;