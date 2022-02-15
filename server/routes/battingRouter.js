const express = require('express');
const router = express.Router();

const { Batting } = require('../models/batting')
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');
const { auth } = require('../middleware/auth');

const {vote,contentList,allowance,closeSerial,closeContent,payOut } = require('../controller/batting');
const {KIP_allowance,KIP_contentList,KIP_closeSerial,KIP_closeContent,KIP_payOut } = require('../controller/caver_batting');

// const {vote,contentList,allowance,closeSerial,closeContent,payOut } = require('../controller/batting');
//const {vote,contentList,allowance,closeSerial,closeContent,payOut } = require('../controller/caver_batting');



 
router.get('/', async (req, res) => {
    

    const contentsName = await Contents.find({}).exec();  
    const content = await Batting.find({}).exec();
    // console.log(contentsName);
    res.json({success:true, contentsName, content})
     
})


router.post("/allowance", KIP_allowance);
 
router.post('/vote', auth, vote);
router.post('/contentList', auth, KIP_contentList);
router.post('/closeSerial', auth, KIP_closeSerial);
router.post('/closeContent', KIP_closeContent);
router.post('/payOut', KIP_payOut);
   
module.exports = router;
