const express = require('express');
const router = express.Router();

const { Batting } = require('../models/batting')
const { Contents } = require('../models/Contents');


 
router.get('/', async (req, res) => {

    const contentsName = await Contents.find({}).exec();   
    const content = await Batting.find({}).exec();

    res.json({success:true, contentsName, content})
     
    
 
})



module.exports = router;
