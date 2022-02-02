require('dotenv').config();
const { User } = require('../models/User');
const { Nft } = require('../models/Nft');
const { Video } = require('../models/Video');
const { Batting } = require('../models/batting');
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');


const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);
// const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
const fs = require('fs');

// const { newContract, infuraWeb3Provider } = require('./index');
const { newContract } = require('./index');
const { json } = require('body-parser');

//계정부분
const serverAddress = process.env.SERVERADDRESS;
const serverPrivateKey = process.env.SERVERPRIVATEKEY;
// auth 권한 부여받은 계정(contract 이용가능 => msg.sender : owner)
const subManagerAddress = '';

// abi json
const WTABI = fs.readFileSync('server/abi/WTToken.json', 'utf-8');
const NWTABI = fs.readFileSync('server/abi/NWTToken.json', 'utf-8');
const NFTABI = fs.readFileSync('server/abi/NFTWT.json', 'utf8');
const SWAPABI = fs.readFileSync('server/abi/TokenSwap.json', 'utf-8');

// abi parse
const nftAbi = JSON.parse(NFTABI);
const wtAbi = JSON.parse(WTABI); // wt token, exchange, vote
const nwtAbi = JSON.parse(NWTABI);
const swapAbi = JSON.parse(SWAPABI);

//contract
const nftContract = newContract(web3, nftAbi, process.env.NFTTOKENCA); // nft
const wtContract = newContract(web3, wtAbi, process.env.WTTOKENCA); // wt
const nwtContract = newContract(web3, nwtAbi, process.env.NWTTOKENCA); // nwt
const swapContract = newContract(web3, swapAbi, process.env.SWAPCA); // swap

module.exports = {
    vote : async (req, res) => {
		//투표한 기록이 있는지 확인해주는 유효성검사 물론 블록체인에서도 검사하지만 두번유효성검사를 해줌으로써 안전에 기여하자.
		console.log(req.body.title);
		const duplicate = await Vote.findOne({
			contentName: req.body.title,
			userAddress : req.user.publicKey,
		}).exec();
		console.log(duplicate);
		if (duplicate !== null) {
			return res.json({ fail: false, detail: '이미 투표를 완료했습니다.' });
		} else {
         //approveToken 함수 작성
			const data = await nwtContract.methods
			.approveToken(req.user.publicKey,serverAddress)
			.encodeABI();
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);
		const gasprice = await web3.eth.getGasPrice();
		const gasPrice = Math.round(
			Number(gasprice) + Number(gasprice / 10)
		);
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
			gasLimit: 5000000,
			data: data,
		};
		const signedTx = await web3.eth.accounts.signTransaction(
			tx,
			serverPrivateKey
		);
		console.log('----- approveToken function start ----');
		const approveHash = await web3.eth.sendSignedTransaction(
			signedTx.rawTransaction
		);
			
			if (approveHash) {
				try {
					const content = await Batting.find({
						contentsName: req.body.title,
						serialNo: req.body.serialNo,
					}).exec();
					const info = {};
					info.voter = req.user._id;
					info.userAddress = req.user.publicKey;
					info.contentName = req.body.title;
					info.contentNum = content[0].contentsNum;
					info.serialNo = req.body.serialNo;
					info.select = req.body.select;
					info.amount = req.body.amount;
	
					const data = await wtContract.methods
						.vote(info.contentNum, info.userAddress, info.select)
						.encodeABI();
					const nonce = await web3.eth.getTransactionCount(
						serverAddress,
						'latest'
					);
					const gasprice = await web3.eth.getGasPrice();
					const gasPrice = Math.round(
						Number(gasprice) + Number(gasprice / 10)
					);
	
					const tx = {
						from: serverAddress,
						to: process.env.WTTOKENCA,
						nonce: nonce,
						gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
						gasLimit: 5000000,
						data: data,
					};
	
					const signedTx = await web3.eth.accounts.signTransaction(
						tx,
						serverPrivateKey
					);
					console.log('----- vote function start ----');
					const hash = await web3.eth.sendSignedTransaction(
						signedTx.rawTransaction
					);
					console.log(hash.logs[0].data);
					console.log(hash.logs[0].topics);
					const typesArray = [
						{
							type: 'uint256',
							name: 'roomNumber',
							type: 'address',
							name: 'user',
							type: 'string',
							name: 'select',
							type: 'uint256',
							name: 'amount',
						},
					];
	
					const decodedParameters = web3.eth.abi.decodeParameters(
						typesArray,
						hash.logs[0].data
					);
					console.log(JSON.stringify(decodedParameters));
					const num = decodedParameters.roomNumber;
					console.log(num);
	
					const vote = new Vote(info);
					vote.save((err, info) => {
						console.log('db저장성공', info);
						res.json({ success: true, detail: 'success db store' });
	
						if (err) {
							return res.json({
								fail: false,
								detail: 'failed store db',
							});	
						}
							
					});
				} catch (e) {
					console.log('blockChain ERR : ' + e);
					res.json({ fail: false, detail: 'failed blockChain' });
				}
			}

			
		 }
	},
	contentList: async (req, res) => {
		try {

			const contentName = req.body.contentName;
			const info = await Batting.find({
				contentsName: contentName,
			}).exec();

			if (info[0] !== undefined) {
				res.json({ success: true, info });
			}
		} catch (e) {
			console.log('err발생 : ' + e);
		}
	},
	allowance: async (req, res) => {
		const allowance = await wtContract.methods.allowance(req.user.publicKey, serverAddress).call();
		console.log(allowance);
	},
	closeSerial: async (req, res) => {
		const { contentsName, serial } = req.body;
		console.log(contentsName,serial);
		// success Fe send normal data;
	    // so we going to transaction to blockChain
 
		//First. we find data in mongoDB
		//Second. if we will be found data, we will change status
		const isCheck = await Batting.findOneAndUpdate({ contentsName, serial }, { status: false }).exec()
       
		console.log(isCheck);
		try {
			if (isCheck !== null) {
				const data = await wtContract.methods
					.closeSerialContent(isCheck.contentsNum)
					.encodeABI();
				const nonce = await web3.eth.getTransactionCount(
					serverAddress,
					'latest'
				);
				const gasprice = await web3.eth.getGasPrice();
				const gasPrice = Math.round(
					Number(gasprice) + Number(gasprice / 10)
				);
	
				const tx = {
					from: serverAddress,
					to: process.env.WTTOKENCA,
					nonce: nonce,
					gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
					gasLimit: 5000000,
					data: data,
				};
	
				const signedTx = await web3.eth.accounts.signTransaction(
					tx,
					serverPrivateKey
				);
				console.log('----- closeContentSerial'+isCheck.contentsNum+'function start ----');
				const hash = await web3.eth.sendSignedTransaction(
					signedTx.rawTransaction
				);
				if (hash) {
					res.status(201).json({ success: true, detail: `${serial}번째 베팅이 종료 되었습니다.` })
				}
		
			} else if (icCheck === null) {
				res.status(404).json({ fail: false, detail: `${serial}번째 베팅이 닫히지 않았습니다.\n 확인바랍니다.` })
			}
		} catch (e) {
			console.log('closeContentSerial function is not ~~' + e);
			res.status(404).json({ fail: false, detail: `${serial}번째 베팅이 닫히지 않았습니다.\n 확인바랍니다.` });
		}
		
	},
	closeContent: async (req, res) => {
		const contentNum = req.body.contentNum;
		const data = await wtContract.methods
		.closeContent(contentNum)
		.encodeABI();
	const nonce = await web3.eth.getTransactionCount(
		serverAddress,
		'latest'
	);
	const gasprice = await web3.eth.getGasPrice();
	const gasPrice = Math.round(
		Number(gasprice) + Number(gasprice / 10	)
	);

	const tx = {
		from: serverAddress,
		to: process.env.WTTOKENCA,
		nonce: nonce,
		gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
		gasLimit: 5000000,
		data: data,
	};

	const signedTx = await web3.eth.accounts.signTransaction(
		tx,
		serverPrivateKey
	);
	console.log('----- closeContent'+contentNum+'function start ----');
	const hash = await web3.eth.sendSignedTransaction(
		signedTx.rawTransaction
	);
		if (hash) {
			res.status(201).json({success:true})
		}

	},
	payOut : async (req, res) => {
		const contentNum = req.body.contentNum;
		const answer = req.body.answer;
		const data = await wtContract.methods
		.payOut(answer,contentNum)
		.encodeABI();
	const nonce = await web3.eth.getTransactionCount(
		serverAddress,
		'latest'
	);
	const gasprice = await web3.eth.getGasPrice();
	const gasPrice = Math.round(
		Number(gasprice) + Number(gasprice / 10)
	);

	const tx = {
		from: serverAddress,
		to: process.env.WTTOKENCA,
		nonce: nonce,
		gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
		gasLimit: 5000000,
		data: data,
	};

	const signedTx = await web3.eth.accounts.signTransaction(
		tx,
		serverPrivateKey
	);
	console.log('----- payOut'+contentNum+'function start ----');
	const hash = await web3.eth.sendSignedTransaction(
		signedTx.rawTransaction
	);
		if (hash) {
			console.log(hash.logs[0].data);
			console.log(hash.logs[0].topics);
			res.status(201).json({success:true})
		}

	}

}