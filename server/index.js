const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const config = require('./config/prod');
const apiRouter = require('./routes/apiRouter');
const cors = require('cors');
const coinRouter = require('./routes/coinRouter');
const batRouter = require('./routes/battingRouter');
const { auth } = require('./middleware/auth');

// const { auth } = require('./middleware/auth');

const { myPage } = require('./controller/api');


//DB connect
const mongoose = require('mongoose');

mongoose
	.connect("mongodb+srv://kimgwhjg:rla121457@gunk.ouvru.mongodb.net/Watto?retryWrites=true&w=majority",{ useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected success !!'))
	.catch((err) => console.log(err));

// app.get('/api/hello', (req, res) => res.send('Hello World!~~ '));

//application/x-www-form-urlencoded //application/json // use 사용 부분
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', apiRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/video', require('./routes/video'));
app.use('/api/user/video', require('./routes/uservideo'));
app.use('/api/comment/', require('./routes/comment'))
app.use('/api/contract', coinRouter);
app.use('/api/bat', batRouter);
app.use('/api/like/', require('./routes/like'))
app.use('/api/subscribe', require('./routes/subscribe'))
//current api/contract/mypage path is error
app.post('/', myPage);

const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
