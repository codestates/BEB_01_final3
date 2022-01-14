const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/prod');
const apiRouter = require('./routes/apiRouter');
const cors = require('cors');
const contractRouter = require('./routes/coinRouter');
const { auth } = require('./middleware/auth');

const { User } = require('./models/User');
const { Nft } = require('./models/Nft');

//DB connect
const mongoose = require('mongoose');

mongoose
	.connect(config.mongoURI)
	.then(() => console.log('MongoDB Connected success !!'))
	.catch((err) => console.log(err));

app.get('/api/hello', (req, res) => res.send('Hello World!~~ '));

//application/x-www-form-urlencoded //application/json // use 사용 부분
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', apiRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/video', require('./routes/video'));

app.use('/api/contract', contractRouter);

app.post('/', (req, res) => {
	const email = req.body.email;

	console.log(email);
	User.find({ email: email }, (err, userResult) => {
		//정보에 해당되는 Nft정보를 다시 긁어와서 보내준다.

		Nft.find({ address: userResult[0].publicKey }, (req, nftResult) => {
			console.log(nftResult);
			res.json({ userInfo: userResult, nftInfo: nftResult });
		});
	});
});
const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
