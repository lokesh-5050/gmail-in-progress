const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/gmail")
const plm = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')


const userSchema = mongoose.Schema({
  username:String,
  name:String,
  email:{
    type:String,
    unique:true
  },
  // sender:[{
  //   userId:  mongoose.Schema.Types.ObjectId,
  //   ref: 'mail'
  // }],
  // reciver:[{
  //   userId:  mongoose.Schema.Types.ObjectId,
  //   ref: 'mail'
  // }]
  mail:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'mail'
  }

  ]
})

userSchema.plugin(plm)
userSchema.plugin(findOrCreate)


module.exports = mongoose.model('user' , userSchema)