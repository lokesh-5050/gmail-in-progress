const mongoose = require('mongoose')

const mailSchema = mongoose.Schema({
    sendingto:String,
    mailtext:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',

    }
    
})


module.exports = mongoose.model('mail' , mailSchema)
