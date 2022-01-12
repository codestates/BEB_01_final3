const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Subscriber = mongoose.model("Subscriber", subscriberSchema); //1st모델의이름,2nd데이터

module.exports = Subscriber; //다른파일에서사용가능