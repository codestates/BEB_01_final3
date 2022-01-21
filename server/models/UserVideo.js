const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uservideoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId, //이런식으로 설정하면 User모델에있는 모든 데이터들을 불러올 수있다.
      ref: "User", //User모델에서 불러오기위해
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    }
  },
  { timestamps: true } //만든 날짜와 update시 날짜가 표시가 된다.
);
const UserVideo = mongoose.model("UserVideo", uservideoSchema); //1st모델의이름,2nd데이터

module.exports = {UserVideo}; //다른파일에서사용가능