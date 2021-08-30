const mongoose=require('mongoose');

const {Schema} = mongoose;

const UserMatchSchema=new Schema({

    u_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"userinfo"
    },

  

})

module.exports=Usermatch=mongoose.model('usermatch', UserMatchSchema);