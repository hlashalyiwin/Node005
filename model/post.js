var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  }
});
module.exports = mongoose.model('Posts', PostSchema);
