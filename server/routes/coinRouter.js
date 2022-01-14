const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const fs = require('fs');
const { Nft } = require('../models/Nft');
const { User } = require('../models/User');

const { exchange_WTToken } = require('../controller/api');

// server address
const serverAddress = '';
const serverPrivateKey = '';
// abi json

// web3
const Web3 = require('web3');
const { LogTimings } = require('concurrently');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6"));



// server 계정 토큰 민팅 - WT (stable coin)
router.get('/faucet', (req, res) => {
	console.log('aa');
	console.log();
});

// server 계정 토큰 민팅 - (유동성 코인)

// user won exchange wt
router.post('/token/exchangeWT', exchange_WTToken);
// /token/exchangeWT
let NFTABI = fs.readFileSync('server/abi/NFTWT.json', 'utf8');
const nftAbi = JSON.parse(NFTABI);
const nftContract = new web3.eth.Contract(nftAbi, process.env.NFTCA);
console.log(Nft);

router.get('/nftList', (req, res) => {
	Nft.find({}, (err, result) => {
		res.json({ data: result });
	});
});

router.post('/', async (req, res) => {
	// 이제 데이터를 프론트에서 받아 옴으로써 블록체인에 올리고 성공하면 DB에 저장까지!

	const {
		userId,
		contentTitle,
		nftName,
		nftDescription,
		imgURI,
		tokenURI,
		price,
	} = req.body.result;

	const sendAccount = process.env.serverAddress;
	const privateKey = process.env.serverAddress_PK;

	const data = await nftContract.methods.mintNFT(tokenURI, price).encodeABI();
	const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');

	const tx = {
		from: sendAccount,
		to: process.env.NFTCA,
		nonce: nonce,
		gas: 5000000,
		data: data,
	};

	const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
	signPromise
		.then((signedTx) => {
			web3.eth.sendSignedTransaction(
				signedTx.rawTransaction,
				async function (err, hash) {
					if (!err) {
						const tokenId = await nftContract.methods
							.TokenId(tokenURI)
							.call();

						const nft = new Nft();
						nft.address = sendAccount;
						(nft.tokenId = tokenId),
							(nft.contentTitle = contentTitle);
						nft.nftName = nftName;
						nft.description = nftDescription;
						nft.imgUri = imgURI;
						nft.tokenUrl = tokenURI;
						nft.price = price;

						nft.save((err, userInfo) => {
							if (err) {
								res.json({ success: false, err });
								return;
							} else {
								res.send('successed!');
							}
						});
					} else {
						console.log(err);
					}
				}
			);
		})
		.catch((err) => {
			console.log('Promise failed:', err);
		});
});

module.exports = router;
 