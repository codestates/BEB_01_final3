const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
      //required: true 로그인 됐을때만 저장
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    responseTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema); //1st모델의이름,2nd데이터

module.exports = Comment; //다른파일에서사용가능