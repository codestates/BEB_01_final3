const express = require('express');
const router = express.Router();

const { Batting } = require('../models/batting')
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');
const { auth } = require('../middleware/auth');
const {test,contentList } = require('../controller/api');


 
router.get('/', async (req, res) => {

    const contentsName = await Contents.find({}).exec();   
    const content = await Batting.find({}).exec();

    res.json({success:true, contentsName, content})
     
})


 
router.post('/vote', auth, test);
router.post('/contentList', auth, contentList);

    

   




module.exports = router;
