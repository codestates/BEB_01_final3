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
    NFTlist: (req, res) => {
		
		Nft.find({ sale: true, type:req.body.type }, (err, result) => {
			res.json({ data: result });
		});
	},
	createNFT: async (req, res) => {
		const { contentTitle, nftName, nftDescription, imgURI, tokenURI } =
			req.body.result;
		try {
			const data = await nftContract.methods
				.mintNFT(tokenURI)
				.encodeABI();
			const nonce = await web3.eth.getTransactionCount(
				serverAddress,
				'latest'
			);
			const gasprice = await web3.eth.getGasPrice();
			const gasPrice = Math.round(
				Number(gasprice) + Number(gasprice / 5)
			);

			const tx = {
				from: serverAddress,
				to: process.env.NFTTOKENCA,
				nonce: nonce,
				gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
				gasLimit: 500000,
				data: data,
			};

			const signedTx = await web3.eth.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			console.log("----- createNFT function start ----");
			const hash = await web3.eth.sendSignedTransaction(
				signedTx.rawTransaction
			);
			const tokenId = web3.utils.hexToNumber(hash.logs[0].topics[3]);
			console.log('tokenId 생성 :' + tokenId);
			const nft = new Nft();
			nft.address = serverAddress;
			nft.tokenId = tokenId;
			nft.contentTitle = contentTitle;
			nft.nftName = nftName;
			nft.description = nftDescription;
			nft.imgUri = imgURI;
			nft.tokenUrl = tokenURI;
			nft.save((err, userInfo) => {
				if (!err) {
					console.log(2);
					res.json({ success: true });
				} else {
					console.log(3);
					res.json({
						failed: false,
						reason: '블록체인에는 올라갔지만 DB에 문제가 생겼습니다.',
					});
				}
			});
		} catch (e) {
			console.log('err' + e);
			console.log(4);
			res.json({ failed: false, reason: '블록체인에 문제가있습니다' });
		}
	},
	buyNFT: async (req, res) => {
		const tokenId = req.body.tokenId;
		const email = req.user.email;
		const userInfo = await User.findOne({ email: email }).exec();
		const buyer = userInfo.publicKey;

	
		const owner = await nftContract.methods.ownerOf(tokenId).call();
	
		if (owner === buyer) {
			console.log("owner is not buy");
			res.json({ failed: false, reason: 'owner is not buy ' });
			return;
		}
		try {
		//approveToken 함수 작성 
		const data = await nwtContract.methods
		.approveToken(buyer,process.env.NFTTOKENCA)
		.encodeABI();
	const nonce = await web3.eth.getTransactionCount(
		serverAddress,
		'latest'
	);
	const gasprice = await web3.eth.getGasPrice();
	const gasPrice = Math.round(Number(gasprice) + Number(gasprice / 10));
	const tx = {
		from: serverAddress,
		to: process.env.NWTTOKENCA,
		nonce: nonce,
		gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
		gasLimit: 5000000,
		data: data,
	};
	const signedTx = await web3.eth.accounts.signTransaction(
		tx,
		serverPrivateKey
	);
	console.log("----- purchaseToken function start ----");
	const approveHash = await web3.eth.sendSignedTransaction(
		signedTx.rawTransaction
	);
			if (approveHash) {
				//approveToken 함수 작성 끝

				const data = await nftContract.methods
					.purchaseToken(tokenId, buyer)
					.encodeABI();
				const nonce = await web3.eth.getTransactionCount(
					serverAddress,
					'latest'
				);
				const gasprice = await web3.eth.getGasPrice();
				const gasPrice = Math.round(Number(gasprice) + Number(gasprice / 10));

				const tx = {
					from: serverAddress,
					to: process.env.NFTTOKENCA,
					nonce: nonce,
					gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
					gasLimit: 5000000,
					data: data,
				};
	
		
				const signedTx = await web3.eth.accounts.signTransaction(
					tx,
					serverPrivateKey
				);
				console.log("----- purchaseToken function start ----");
				const sellHash = await web3.eth.sendSignedTransaction(
					signedTx.rawTransaction
				);
	
				if (sellHash) {
					const owner = await nftContract.methods.ownerOf(tokenId).call();
					console.log(owner);
					Nft.findOneAndUpdate(
						{ tokenId: tokenId },
						{ address: owner, sale: false },
						(err, result) => {
							console.log('DB success');

							res.json({
								success: true,
								detail: 'db store success and block update success',
							});
						}
					);
				}
		
				
			}
				
		
		} catch (e) {
			console.log(e);
			// res.json({ failed: false, reason: 'i do not know' });
		}
	},
	setForSell: async (req, res) => {
		const tokenId = req.body.tokenId;
		const privateKey = req.body.privateKey;
		const sellPrice = req.body.sellPrice;
		const owner = await nftContract.methods.ownerOf(tokenId).call();
		const dbOwner = await Nft.find({ tokenId: tokenId }).exec();

		//가격에 숫자이외의 문자가 들어오지 않게 하기위한 정규식
		var regexp = /^[0-9]*$/;
		if (!regexp.test(sellPrice)) {
			console.log(1);
			res.json({
				fail: false,
				detail: '정확한 가격을 작성해주세요!!',
			});
		}
		
		if (owner !== dbOwner[0].address) {
			console.log("소유자가 다르다 오류났다.");
			res.json({
				fail: false,
				detail: '소유자가 다르다, 확인바람',
			});
		}
		

		console.log(tokenId, privateKey, sellPrice);
		const data = await nftContract.methods
			.setForSale(tokenId, web3.utils.toWei(sellPrice, 'ether'))
			.encodeABI();
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);
		const gasprice = await web3.eth.getGasPrice();
		const gasPrice = Math.round(Number(gasprice) + Number(gasprice / 10));
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
			gasLimit: 5000000,
			data: data,
		};
		
		try {
			const signedTx = await web3.eth.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			console.log("----- setForSale function start ----");
			const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
			
			if (hash) {
				//프로필이랑 팔려고하는 사진이랑 다른 경우
					if (privateKey === undefined) {
						Nft.findOneAndUpdate(
							{ tokenId: tokenId },
							{ sale: true, price: sellPrice, type : "fixed"},
							(err, result) => {
								console.log('DB success');
								res.json({
									success: true,
									detail: 'success set sell and change basic image',
								});
								if (err) console.log(err);
							}
						);
					} else {
						Nft.findOneAndUpdate({tokenId: tokenId,},{sale: true,price: sellPrice},(err, result) => {
								console.log(privateKey);
								User.findOneAndUpdate(
									{
										privateKey: privateKey,
									},
									{
										image: 'cryptoWT',
									},
									(err, result) => {
										console.log('DB success');
										res.json({
											success: true,
											detail: 'success set sell and change basic image',
										});
										if (err) console.log(err);
									}
								);
							}
						);
					}
			}
			

					
				
		} catch (e) {
			console.log(e);
			
		}
	},
	cancel: (req, res) => {
		const tokenId = req.body.tokenId;
		Nft.findOneAndUpdate(
			{ tokenId: tokenId },
			{ sale: false },
			(err, result) => {
				console.log('user gonna cancel sell for nft');
				res.json({
					success: true,
					detail: 'user gonna cancel sell for nft',
				});
				if (err) console.log(err);
			}
		);
	},
	setToken: async (req, res) => {
		const data = await nftContract.methods
			.setToken(process.env.NWTTOKENCA)
			.encodeABI();
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);
		const gasprice = await web3.eth.getGasPrice();
		const gasPrice = Math.round(Number(gasprice) + Number(gasprice / 3));
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
			gasLimit: 5000000,
			data: data,
		};
		
		
			const signedTx = await web3.eth.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			console.log("----- setToken function start ----");
			const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
			
			if (hash) {
				res.json({ success: true });
			}
		
	},

}