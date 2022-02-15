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
const path = require('path');
// const { auth } = require('./middleware/auth');

const { myPage } = require('./controller/api');


//DB connect
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGDB, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected success !!'))
	.catch((err) => console.log(err));

	app.use(express.static('client/build'));
	// app.get('*', (req, res) => {
	// 	res.sendFile(path.resolve("client", "build", "index.html"));
	//   })
	

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
//app.use(express.static('client/build'));
//current api/contract/mypage path is error
app.post('/', myPage);



const port = 5000;

// app.get('*', (req, res) => {
// 	res.sendFile(path.resolve("client", "build", "index.html"));
//   })
  



const Caver = require('caver-js');
const caver = new Caver(
	new Caver.providers.HttpProvider('https://api.baobab.klaytn.net:8651')
);

app.post('/test', async (req, res) => {		
	//const ab = await caver.account.create(process.env.SERVERADDRESS, process.env.SERVERPRIVATEKEY);
	// const result = await 	(process.env.SERVERPRIVATEKEY);
	// console.log('result',result);
	// let getAccount = caver.klay.accounts.privateKeyToAccount(process.env.SERVERPRIVATEKEY);
	// console.log(getAccount.address);	
	// let exist = await caver.klay.accountCreated(process.env.SERVERADDRESS)
	// console.log(exist);
	
	// const keyring = await caver.wallet.keyring.createFromPrivateKey(process.env.SERVERPRIVATEKEY);
	// console.log('kerying',keyring);
	//caver.rpc.klay.getAccount(process.env.SERVERADDRESS).then(console.log)
	//caver.klay.getAccounts().then(console.log);
	
})

  
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
