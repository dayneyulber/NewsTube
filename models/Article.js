var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true,
    unique: true
  },

  body: {
    type: String,
  },

  link: {
    type: String,
    required: true
  },

  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },
  inserted: {
    type: Date,
    default: Date.now
  }
});


var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;