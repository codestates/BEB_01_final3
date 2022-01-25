const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentsSchema = mongoose.Schema(
  {
    contentName: {
      type: String,
    },
    contentNum: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true
    },
      
  },
  { timestamps: true } //만든 날짜와 update시 날짜가 표시가 된다.
);
const Contents = mongoose.model("contents", contentsSchema); //1st모델의이름,2nd데이터

module.exports = {Contents}; //다른파일에서사용가능