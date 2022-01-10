const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/prod');
const apiRouter = require('./routes/apiRouter');

//const contractRouter = require('./routes/coinRouter');


//DB connect
const mongoose = require('mongoose');


mongoose
	.connect(config.mongoURI)
	.then(() => console.log('MongoDB Connected success !!'))
	.catch((err) => console.log(err));



app.get('/api/hello', (req, res) => res.send('Hello World!~~ '));

//application/x-www-form-urlencoded //application/json // use 사용 부분
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', apiRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/video', require('./routes/video'));

//app.use('/contract', contractRouter);

const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
