const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const { Video } = require("../models/Video");
const { Batting } = require('../models/batting');
const { SearchContent, videoUpload } = require('../controller/api');
const { closeSerial } = require('../controller/batting')


let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //uploads라는 폴더에 file을 저장
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
    //파일이름을 현재시간_파일이름.mp4로 저장하겠다는의미(중복방지)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      //파일확장자는 mp4만허용 추가하고싶다면 || ext !== '.wmv' 와같이가능
      return cb(res.status(400).end("only mp4 is allowd"), false);
    }
    cb(null, true);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }
}).single("file"); //파일하나만업로드하겠다는의미



//=====================================================
//                      Videos
//=====================================================

router.post("/uploads", (req, res) => {
  //비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path, //파일을 저장하게되면 uploads폴더안에 저장되게되는데 그경로를 보내줌
      fileName: res.req.file.filename,
    });
  });
});

router.post("/uploadVideo", videoUpload);


router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다.
  Video.find() //Video collection에있는 모든 데이터들을 찾는다.
    .populate("writer") //writer에 type으로 Schema.Types.ObjectId라고 지정을 해주었었는데 populate를 걸어줘야 user에있는 모든 데이터들을 들고올 수있다.
    //populate를 안걸어 줄 경우 writer의 id만 가져온다.
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/thumbnail", (req, res) => {
  //썸네일 생성 하고 비디오 러닝타임도 가져오는 api

  let fileDuration = "";
  let filePath = "";
  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    //url을 받으면 해당 비디오에대한 정보가 metadata에담김
    console.log('rbu', req.body);
    console.log('meta', metadata);//metadata안에담기는 모든정보들 체킹
    fileDuration = metadata.format.duration; //동영상길이대입
  });
  //썸네일 생성
  ffmpeg(req.body.url) //클라이언트에서보낸 비디오저장경로
    .on("filenames", function (filenames) {
      //해당 url에있는 동영상을 밑에 스크린샷옵션을 기반으로
      //캡처한후 filenames라는 이름에 파일이름들을 저장
      console.log("will generate " + filenames.join(","));
      console.log("filenames:", filenames);

      filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      console.log("Screenshots taken");
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
      //fileDuration :비디오 러닝타임
    })
    .on("error", function (err) {
      console.log(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      //Will take screenshots at 20% 40% 60% and 80% of the video
      count: 3,
      folder: "uploads/thumbnails",
      size: "320x240",
      //'%b':input basename(filename w/o extension) = 확장자제외파일명
      filename: "thumbnail-%b.png",
    });
});

router.post("/getVideoDetail", async (req, res) => {
  // const closeInfo = await Batting.find({ videoId: req.body.videoId }).exec();
  // const close = {contentsName : closeInfo[0].contentsName, serial : closeInfo[0].serial}
  // console.log('detail',req.body);
  Video.findOne({ _id: req.body.videoId })
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail, close });
    });
});

router.get("/getVideos", (req, res) => {
  //비디오를 DB에서 가져와서 클라이언트에 보낸다.
  Video.find() //Video collection에있는 모든 데이터들을 찾는다.
    .populate("writer") //writer에 type으로 Schema.Types.ObjectId라고 지정을 해주었었는데 populate를 걸어줘야 user에있는 모든 데이터들을 들고올 수있다.
    //populate를 안걸어 줄 경우 writer의 id만 가져온다.
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post("/SearchVideos", SearchContent);

router.post('/image', (req, res) => {

  //가져온 이미지를 저장을 해주면 된다.
  upload(req, res, err => {
      if (err) {
          return req.json({ success: false, err })
      }
      return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })

})


router.post('/closeSerial', closeSerial);


module.exports = router;