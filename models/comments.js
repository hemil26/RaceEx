var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema(
  {
    text: {
        type: String,
        trim: true,
        maxlength: 100,
        minlength: 1,
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        trim: true,
        maxlength: 20,
        minlength: 3,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
