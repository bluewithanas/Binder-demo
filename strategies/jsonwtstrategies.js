var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const mongoose=require('mongoose')
    var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =  require('../setup/mongourl').secret;
const UserModal=require('../models/UserSchema');



module.exports=passport=>{
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // UserModal.findById(jwt_payload.id}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });

    UserModal.findById(jwt_payload.id).then(user=>{
        if(user){
            return done(null, user);
        }

        return done(null, false);
    }).catch(err=>console.log(err))

}));

}
