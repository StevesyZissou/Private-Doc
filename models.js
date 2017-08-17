var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }, 
  docs: [
    {
      type: mongoose.Schema.ObjectId, 
      ref: 'Doc'
    }
  ]
});

const documentSchema = mongoose.Schema({
  title: String,
  editorState: Object,
  collabs: [
    {
  //array of users that have access to the doc
      type: mongoose.Schema.ObjectId,
      ref:'User'
    }],
  //important to keep track of date created for docs later
  dateCreated: Date,
  owner: {
    type:mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const User = mongoose.model('User', userSchema);
const Doc = mongoose.model('Doc', documentSchema);

module.exports = {
  User: User,
  Doc: Doc
};
