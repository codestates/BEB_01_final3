const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const apiRouter = require("./routes/apiRouter")

//DB connect 
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI
).then(() => console.log('MongoDB Connected success !!'))
.catch(err => console.log(err))

//dotenv
require("dotenv").config();


app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))



//application/x-www-form-urlencoded //application/json // use 사용 부분 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api',apiRouter);

const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))