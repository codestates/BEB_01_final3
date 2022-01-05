const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");
const apiRouter = require("./routes/apiRouter")

//DB connect 
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI
).then(() => console.log('MongoDB Connected success !!'))
.catch(err => console.log(err))

//dotenv
require("dotenv").config();

//application/x-www-form-urlencoded //application/json // use 사용 부분 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api',apiRouter);







const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))