const mongoose= require('mongoose');

const {Schema} = mongoose;

const UserinfoSchema= new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },

    dob:{
        type: Date,
        required: true
    },

    interest: {
        type: String,
        required: true
    },

    location:{
        type: String,
        required: true
    },

    fav_book: {
        type: String,
        required: true
    },

    book_offering: {
        type: String,
        required: true
    },

    fav_quote: {
        type: String,
        required: true
    },

    social_url:{
        type: String,
        required: true
    }

})

module.exports=Userinfo=mongoose.model('Userinfo', UserinfoSchema);