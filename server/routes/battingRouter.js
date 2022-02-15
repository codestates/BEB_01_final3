const express = require('express');
const router = express.Router();

const { Batting } = require('../models/batting')
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');
const { auth } = require('../middleware/auth');
// const {vote,contentList,allowance,closeSerial,closeContent,payOut } = require('../controller/batting');
const {vote,contentList,allowance,closeSerial,closeContent,payOut } = require('../controller/caver_batting');


 
router.get('/', async (req, res) => {
    

    const contentsName = await Contents.find({}).exec();  
    const content = await Batting.find({}).exec();
    // console.log(contentsName);
    res.json({success:true, contentsName, content})
     
})


router.get("/allowance", auth, allowance);
 
router.post('/vote', auth, vote);
router.post('/contentList', auth, contentList);
router.post('/closeSerial', auth, closeSerial);
router.post('/closeContent', closeContent);
router.post('/payOut', payOut);

    

   




module.exports = router;
