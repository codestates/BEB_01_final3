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
	userJoin: async (req, res) => {
		//지갑을 생성하고 지갑을 추가해주는 메서드
		const account = await web3.eth.accounts.create(
			web3.utils.randomHex(32)
		);
		await web3.eth.accounts.wallet.add({
			address: account.address,
			privateKey: account.privateKey,
		});

		try {
			const data = await nftContract.methods
				.approveSale(account.address)
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
			const hash = await web3.eth
				.sendSignedTransaction(signedTx.rawTransaction)
				.on('receipt', (txHash) => {
					const userInfo = {
						...req.body,
						publicKey: account.address,
						privateKey: account.privateKey,
						wtToken: 5,
						nwtToken: 5,
						nftToken: '',
					};
					const user = new User(userInfo);

					user.save((err, userInfo) => {
						if (err) {
							res.json({ success: false, err });
							return;
						}
						console.log('ui', userInfo);
						res.status(200).json({
							success: true,
						});
					});
				});
		} catch (e) {
			console.log(e);
			res.json({ failed: false });
		}
	},
	userLogin: (req, res) => {
		// console.log('ping')
		//요청된 이메일을 데이터베이스에서 있는지 찾는다.
		User.findOne({ email: req.body.email }, (err, user) => {
			// console.log('user', user)
			if (!user) {
				return res.json({
					loginSuccess: false,
					message: '제공된 이메일에 해당하는 유저가 없습니다.',
				});
			}

			//요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
			user.comparePassword(req.body.password, (err, isMatch) => {
				// console.log('err',err)

				// console.log('isMatch',isMatch)

				if (!isMatch)
					return res.json({
						loginSuccess: false,
						message: '비밀번호가 틀렸습니다.',
					});

				//비밀번호 까지 맞다면 토큰을 생성하기.
				user.generateToken((err, user) => {
					if (err) return res.status(400).send(err);

					// 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지
					res.cookie('x_auth', user.token)
						.status(200)
						.json({ loginSuccess: true, userId: user._id });
				});
			});
		});
	},

	Auth: (req, res) => {
		//여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
		res.status(200).json({
			_id: req.user._id,
			isAdmin: req.user.role === 0 ? false : true,
			isAuth: true,
			email: req.user.email,
			name: req.user.name,
			lastname: req.user.lastname,
			role: req.user.role,
			image: req.user.image,
		});
	},

	userLogout: (req, res) => {
		// console.log('req.user', req.user)
		User.findOneAndUpdate(
			{ _id: req.user._id },
			{ token: '' },
			(err, user) => {
				if (err) return res.json({ success: false, err });
				return res.status(200).send({
					success: true,
				});
			}
		);
	},
	// 각자 DB 사용 시 주석 제거
	userTokens: async (req, res) => {
		try {
			const user = await User.findOne({ _id: req.user._id }).exec(); // login 되어 있는 user 정보확인
			const userPK = user.publicKey; // user 의 주소
			try {
				const wtAmount = await wtContract.methods
					.balanceOf(userPK)
					.call(); // 유저의 wt 보유량
				const nwtAmount = await nwtContract.methods
					.balanceOf(userPK)
					.call(); // 유저의 nwt 보유량

				const userTokens = {
					wtToken: web3.utils.fromWei(wtAmount, 'ether'),
					nwtToken: web3.utils.fromWei(nwtAmount, 'ether'),
				};

				res.json({ success: true, userTokens });
			} catch (err) {
				res.json({
					success: false,
					message: '블록체인 네트워크에 오류가 있음',
				});
			}
		} catch (err) {
			res.json({ success: false, message: 'DB에 오류 생김' });
		}
	},
	// 공용 DB 사용 시 주석 제거
	// userTokens: (req, res) => {
	// 	try {
	// 		User.findOne({ _id: req.user._id }, (err, user) => {
	// 			const userTokens = {
	// 				wtToken: user.wtToken,
	// 				nwtToken: user.nwtToken,
	// 			};
	// 			res.json(userTokens);
	// 		});
	// 	} catch (err) {
	// 		res.json({ success: false, err });
	// 	}
	// },

	// 현금 <-> WT
	exchange_WTToken: async (req, res) => {
		// console.log('Aa');
		// console.log(req.body);
		const wtAmount = req.body.wtToken; // 가격에 대한 wt token 개수
		const wt = wtAmount / 1000;
		console.log(wtAmount, wt);

		const userPK = await User.findOne({ _id: req.user._id }).exec(); // user의 정보
		// user의 개인키 앞에 0x 자름
		// const privateKey = userPK.privateKey.substr(
		// 	2,
		// 	userPK.privateKey.length - 1
		// );

		// nonce 값
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);

		// 실행할 컨트랙트 함수 데이터
		const data = await wtContract.methods
			.exchange(userPK.publicKey, parseInt(wtAmount))
			.encodeABI();

		const gasPrice = await web3.eth.getGasPrice();

		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice,
			gas: 5000000,
			data: data,
		};

		const signedTx = await web3.eth.accounts.signTransaction(
			tx,
			serverPrivateKey
		);

		try {
			// 블록체인 web3 처리
			await web3.eth
				.sendSignedTransaction(signedTx.rawTransaction) // sendTranscation
				.on('receipt', (txHash) => {
					console.log(txHash);
					res.json({
						success: true,
						message: 'wt token 교환 성공',
					});
				});
		} catch (err) {
			console.log('블록체인에 문제가 있습니다.');
			res.json({ success: false, message: err });
		}
	},

	// WT <-> NWT
	exchange_NWTToken: async (req, res) => {
		console.log('aaaaa');
		const nwtAmount = req.body.nwtToken;
		const nwt = parseInt(nwtAmount) / 5;

		const user = await User.findOne({ _id: req.user._id }).exec();

		const nonce1 = await web3.eth.getTransactionCount(
			// user.publicKey,
			serverAddress,
			'latest'
		);

		const inputWT = web3.utils.toWei(nwtAmount, 'ether');

		const data1 = await wtContract.methods
			.approveToken(user.publicKey, process.env.SWAPCA)
			.encodeABI();

		// const data1 = await wtContract.methods
		// 	.approve(process.env.SWAPCA, inputWT)
		// 	.encodeABI();

		const gasPrice1 = await web3.eth.getGasPrice();

		const gasPricee = Math.round(
			Number(gasPrice1) + Number(gasPrice1 / 30)
		);

		const tx1 = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce1,
			gasPrice: gasPrice1,
			// gasPrice: gasPrice1,
			gas: 500000,
			data: data1,
		};

		const signedTx1 = await web3.eth.accounts.signTransaction(
			tx1,
			serverPrivateKey
		);

		await web3.eth
			.sendSignedTransaction(signedTx1.rawTransaction)
			.on('receipt', async (txHash) => {
				// console.log(txHash);
				try {
					const nonce2 = await web3.eth.getTransactionCount(
						// user.publicKey,
						serverAddress,
						'latest'
					);

					const data2 = await nwtContract.methods
						.approveToken(serverAddress, process.env.SWAPCA)
						.encodeABI();

					const gasPrice2 = await web3.eth.getGasPrice();

					const tx2 = {
						from: serverAddress,
						to: process.env.NWTTOKENCA,
						nonce: nonce2,
						gasPrice: gasPrice2,
						// gasPrice: gasPrice1,
						gas: 500000,
						data: data2,
					};
					const signedTx2 = await web3.eth.accounts.signTransaction(
						tx2,
						serverPrivateKey
					);
					await web3.eth
						.sendSignedTransaction(signedTx2.rawTransaction)
						.on('receipt', async (txHash) => {
							console.log('유저, 서버 둘다 approve 성공');

							try {
								const nonce3 =
									await web3.eth.getTransactionCount(
										// user.publicKey,
										serverAddress,
										'latest'
									);
								const data3 = await swapContract.methods
									.swap(
										parseInt(nwtAmount),
										user.publicKey,
										process.env.SWAPCA,
										process.env.WTTOKENCA,
										process.env.NWTTOKENCA
									)
									.encodeABI();

								const gasPrice3 = await web3.eth.getGasPrice();

								const tx3 = {
									from: serverAddress,
									to: process.env.SWAPCA,
									nonce: nonce3,
									gasPrice: gasPrice3,
									// gasPrice: gasPrice1,
									gas: 500000,
									data: data3,
								};
								const signedTx3 =
									await web3.eth.accounts.signTransaction(
										tx3,
										serverPrivateKey
									);
								await web3.eth
									.sendSignedTransaction(
										signedTx3.rawTransaction
									)
									.on('receipt', async (txHash) => {
										console.log('교환 성공!!');
										console.log(txHash);
										res.json({
											success: true,
											message: '교환 성공',
										});
									});
							} catch (err) {
								console.log(err);
								res.json({
									success: false,
									message: '교환실패',
								});
							}
						});
				} catch (err) {
					console.log(err);
					res.json({
						success: false,
						message: '교환실패',
					});
				}
			});
	},

	// 수정중.. (server 계정의 auth 유지.. 방법알기)
	// 서버계정 wt token 받는 방법 : http://localhost:5000/api/contract/token/faucet - postman get 요청
	serverWT_faucet: async (req, res) => {
		// web3.eth.accounts.wallet.add(serverPrivateKey);

		// nonce 값
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);

		// 실행할 컨트랙트 함수 데이터
		const data = await wtContract.methods
			.mintToken(serverAddress, web3.utils.toWei('1000000', 'ether')) //1e18  100000000
			.encodeABI();

		const gasPrice = await web3.eth.getGasPrice();

		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice,
			gas: 210000,
			data: data,
		};

		// transaction 서명
		const signedTx = await web3.eth.accounts.signTransaction(
			tx,
			serverPrivateKey
		);

		try {
			await web3.eth
				.sendSignedTransaction(signedTx.rawTransaction)
				.on('receipt', (txHash) => {
					console.log(txHash);
					res.json({
						success: true,
						message: '서버 계정 wt token 민팅 성공',
					});
				});
		} catch (err) {
			console.log(err);
			console.log('블록체인에 안올라감');
		}
	},

	// server nwt token faucet
	serverNWT_faucet: async (req, res) => {
		console.log('aa');
		// web3.eth.accounts.wallet.add(serverPrivateKey);

		// nonce 값
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);

		// const balanceOf = await nwtContract.methods
		// 	.balanceOf(serverAddress)
		// 	.call();

		// console.log(typeof balanceOf);

		// 실행할 컨트랙트 함수 데이터
		const data = await nwtContract.methods
			.mintToken(
				serverAddress,
				web3.utils.toWei('100000', 'ether'),
				process.env.NFTTOKENCA //1e18  100000000
			)
			.encodeABI();

		const gasPrice = await web3.eth.getGasPrice();

		// const balanceOf = await nwtContract.methods
		// 	.balanceOf(serverAddress)
		// 	.call();
		// const test1 = web3.utils.fromWei('100000', 'ether');
		// const test2 = web3.utils.toWei('100000', 'ether');
		// console.log('test1 : ', test1);
		// console.log('test2 : ', test2);

		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.NWTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice, // 우리가 사용하는 양
			gas: 500000, // 최대한 사용가능한 한도 210000
			data: data,
		};

		// transaction 서명
		const signedTx = await web3.eth.accounts.signTransaction(
			tx,
			serverPrivateKey
		);

		try {
			await web3.eth
				.sendSignedTransaction(signedTx.rawTransaction)
				.on('receipt', async (txHash) => {
					console.log(txHash);
					res.json({
						success: true,
						message: '서버 계정 nwt token 민팅 성공',
					});
				});
		} catch (err) {
			console.log('블록체인에 안올라감..');
			console.log(err);
		}
	},
	NFTlist: (req, res) => {
		console.log("NFTlist search");
		Nft.find({ sale: true }, (err, result) => {
			res.json({ data: result });
		});
	},
	createNFT: async (req, res) => {
		const {
			contentTitle,
			nftName,
			nftDescription,
			imgURI,
			tokenURI,	
		} = req.body.result;
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
			const hash = await web3.eth.sendSignedTransaction(
				signedTx.rawTransaction
			);
			const tokenId = web3.utils.hexToNumber(hash.logs[0].topics[3]);
			console.log('tokenId 생성 :'+tokenId);
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

		console.log(tokenId);
		const owner = await nftContract.methods.ownerOf(tokenId).call();

		if (owner === buyer) {
			res.json({ failed: false, reason: 'owner is not buy ' });
			return;
		}

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
			gasLimit: 500000,
			data: data,
		};
		try {
			const signedTx = await web3.eth.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			await web3.eth.sendSignedTransaction(
				signedTx.rawTransaction,
				(err, hash) => {
					Nft.findOneAndUpdate(
						{ tokenId: tokenId },
						{ address: buyer, sale: false },
						(err, result) => {
							console.log('DB success');

							res.json({
								success: true,
								detail: 'db store success and block update success',
							});
						}
					);
				}
			);
		} catch (e) {
			console.log(e);
			res.json({ failed: false, reason: 'i do not know' });
		}
	},

	myPage: async (req, res) => {
		// console.log('here api')
		let wtdata = await wtContract.methods.balanceOf(serverAddress).call();
		let wtData = web3.utils.fromWei(wtdata, 'ether');
		// console.log(wtData);
		let nwtdata = await nwtContract.methods.balanceOf(serverAddress).call();
		let nwtData = web3.utils.fromWei(nwtdata, 'ether');
		// console.log(nwtData);

		// console.log(req.user);
		try {
			// 현재 로그인된 user 정보 찾아서
			User.findOne({ _id: req.user._id }, (err, user) => {
				// userInfo 에 필요한 정보 담고

				// console.log(wtContract.methods.balanceOf(serverAddress).call());
				const userInfo = {
					publicKey: user.publicKey,
					privateKey: user.privateKey,
					wtToken: wtData,
					nwtToken: nwtData,
					image: user.image,
				};
				// 그 유저가 가지고 있는 nft 정보를 가져옴
				Nft.find({ address: user.publicKey }, (err, nft) => {
					const nftInfo = nft;

					// nft 가 없으면 유저 정보만 넘기고
					if (nft === null) {
						res.json({ success: true, userInfo });
					} else {
						// 있으면 둘다 넘김
						res.json({ success: true, userInfo, nftInfo });
					}
				});
			});
		} catch (err) {
			res.json({ success: false, err });
		}
	},

	setForSell: async (req, res) => {

		const tokenId = req.body.tokenId;
		const privateKey = req.body.privateKey;
		const sellPrice = req.body.sellPrice;

		//가격에 숫자이외의 문자가 들어오지 않게 하기위한 정규식 
			var regexp = /^[0-9]*$/;
			if (!regexp.test(sellPrice)) {
				console.log(1);
				res.json({
					fail : false,
					detail: '정확한 가격을 작성해주세요!!',
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
				const gasPrice = Math.round(
					Number(gasprice) + Number(gasprice / 5)
				);
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
			gasLimit: 5000000,
			data: data,
		};

		console.log(tx);

		try {
			const signedTx = await web3.eth.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			await web3.eth
				.sendSignedTransaction(signedTx.rawTransaction)
				.on('receipt', (txHash) => {
					console.log(txHash);

					//프로필이랑 팔려고하는 사진이랑 다른 경우
					if (privateKey === undefined) {
						Nft.findOneAndUpdate(
							{ tokenId: tokenId },
							{ sale : true, price : sellPrice },
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
						Nft.findOneAndUpdate(
							{
								tokenId: tokenId,
							},
							{
								sale: true, price : sellPrice 
							},
							(err, result) => {
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
				});
		} catch (e) {
			console.log(e);
			res.json({ failed: false });
		}
	},
	ownerOf: async (req, res) => {
		const owner = await nftContract.methods.ownerOf('8').call();

		console.log(owner);
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

	SearchNft: async (req, res) => {
		// console.log('req.user', req.user)
		let name = req.body.name;

		const nftInfo = await Nft.find().find({
			nftName: { $regex: name, $options: 'i' },
		});

		console.log('nft', nftInfo[0]);

		if (nftInfo[0]) {
			res.status(201).json({ success: true, data: nftInfo, type: 'nft' });
		} else {
			console.log(1);
			res.json({ success: false });
		}
	},

	SearchContent: async (req, res) => {
		let name = req.body.name;

		console.log('name?', name);

		const contentInfo = await Video.find().find({
			title: { $regex: name, $options: 'i' },
		});

		if (contentInfo[0]) {
			res.status(201).json({
				success: true,
				data: contentInfo,
				type: 'Content',
			});
		} else {
			res.json({ success: false });
		}
		console.log('api.content', contentInfo);
	},
	// server developer page total wt tokens, server developer page total nwt tokens
	TotalTokens: async (req, res) => {
		const server = await User.findOne({ _id: req.user._id }).exec();
		// const server = await User.findOne({ publicKey: serverAddress }).exec();
		if (server.role === 1) {
			try {
				let dataWT = await wtContract.methods.totalSupply().call();
				let totalWt = web3.utils.fromWei(dataWT, 'ether'); // 총 발행된 wt tokens

				let dataNWT = await nwtContract.methods.totalSupply().call();
				let totalNwt = web3.utils.fromWei(dataNWT, 'ether'); // 총 발행된 nwt tokens

				let data_server_WT = await wtContract.methods
					.balanceOf(serverAddress) // 관리자 추가 생기면 server.publicKey로 교체
					.call();
				let server_WT = web3.utils.fromWei(data_server_WT, 'ether'); // server wt tokens

				let data_server_NWT = await nwtContract.methods
					.balanceOf(serverAddress) // 관리자 추가 생기면 server.publicKey로 교체
					.call();
				let server_NWT = web3.utils.fromWei(data_server_NWT, 'ether'); // server nwt tokens

				let data = {
					totalWT: totalWt,
					totalNWT: totalNwt,
					serverWT: server_WT,
					serverNWT: server_NWT,
				};
				res.json({ success: true, data });
			} catch (err) {
				res.json({ success: false, message: err });
			}
		} else {
			res.json({ success: false, message: '관리자 계정이 아닙니다.' });
		}
	},
	setProfilImg: (req, res) => {
		const img = req.body.img;
		const userId = req.user._id;

		console.log(img, userId);

		User.findOneAndUpdate(
			// 현재 로그인 되어있는 유저의 wtToken 양 증가
			{ _id: userId },
			{ image: img },
			(err, user) => {
				if (err) {
					console.log(err);
					console.log('user DB에 이미지 업데이트 실패');
					res.json({ fail: false });
				} else {
					console.log(user);
					console.log('이미지 저장 성공!');
					res.json({ success: true });
				}
			}
		);
	},
	videoUpload: async (req, res) => {
		console.log(req.body);
		const rawTitle = req.body.title;
		const title = rawTitle
			.slice(0, rawTitle.indexOf(']') + 1)
			.replace(/(\s*)/g, '');
		const subTitle = rawTitle
			.slice(rawTitle.indexOf(']') + 1, rawTitle.indexOf('E'))
			.replace(/(\s*)/g, '');
		const serialNo = rawTitle
			.slice(rawTitle.indexOf('.') + 1, rawTitle.length)
			.replace(/(\s*)/g, '');
		console.log(serialNo);

		const result = await Batting.find({ contentsName: title }).exec();
		if (result[0] === undefined) {
			//새롭게 방을 만드는 거에요!
			const video = new Video(req.body);
			video.save(async (err, doc) => {
				//비디오가 save되면서 contentsRoom이란느 함수를 실행시키고
				const data = await wtContract.methods
					.createContent()
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
				const hash = await web3.eth.sendSignedTransaction(
					signedTx.rawTransaction
				);

				const typesArray = [{ type: 'uint256', name: 'num' }];

				const decodedParameters = web3.eth.abi.decodeParameters(
					typesArray,
					hash.logs[0].data
				);
				console.log(JSON.stringify(decodedParameters));
				const num = decodedParameters.num;

				console.log(title, subTitle, num, serialNo);
				const batting = new Batting({
					contentsName: title,
					subTitle: subTitle,
					contentsNum: num,
					serial: Number(serialNo),
				});
				const contents = new Contents({
					contentName: title,
					contentNum: num,
				});
				batting.save((err, info) => {
					contents.save((err, info) => {
						console.log(err);
						if (err) return res.json({ success: false, err });
						res.status(200).json({ success: true });
					});
				});
				//실행이 끝나면 DB에 방이 개설됬다고 열어주자.
			});
		} else {
			//이미 새롭게 방이 되어있습니다. serial에 추가시켜주시고 openSerialContent를 true로 활성화시켜주세요
			const video = new Video(req.body);
			video.save(async (err, doc) => {
				//비디오가 save되면서 contentsRoom이란느 함수를 실행시키고
				const data = await wtContract.methods
					.openSerialContent(result[0].contentsNum)
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
				const hash = await web3.eth.sendSignedTransaction(
					signedTx.rawTransaction
				);

				const batting = new Batting({
					contentsName: title,
					subTitle: subTitle,
					contentsNum: result[0].contentsNum,
					serial: Number(serialNo),
				});

				batting.save((err, info) => {
					if (err) return res.json({ success: false, err });
					res.status(200).json({ success: true });
				});

				// if (err) return res.json({ success: false, err });
				// res.status(200).json({ success: true });
			});
		}
	},
	test: async (req, res) => {
		//투표한 기록이 있는지 확인해주는 유효성검사 물론 블록체인에서도 검사하지만 두번유효성검사를 해줌으로써 안전에 기여하자.
		const duplicate = await Vote.find({
			contentsName: req.body.title,
			userAddress: req.user.publicKey,
		}).exec();
		if (duplicate[0] !== undefined) {
			return res.json({ fail: false, detail: 'user already vote that' });
		} else {
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
				)
				const hash = await web3.eth.sendSignedTransaction(
					signedTx.rawTransaction
				);
				const typesArray = [
					{
						type: 'uint256',
						name: 'roomNumber',
						type: 'address',
						name: 'user',
						type: 'select',
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
					if (err)
						return res.json({
							fail: false,
							detail: 'failed store db',
						});
				});
			} catch (e) {
				console.log('blockChain ERR : ' + e);
				res.json({ fail: false, detail: 'failed blockChain' });
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
	// server 계정들 가져오기
	getServerList: async (req, res) => {
		// console.log('api 부분');
		const serverInfo = [];
		let totalCurrentWT = 0;
		let totalCurrentNWT = 0;
		const serverList = await User.find({ role: 1 }).exec();

		try {
			for (value in serverList) {
				let imgInfo = await Nft.findOne({
					address: serverList[value].publicKey,
				}).exec();
				let serverWT = await wtContract.methods
					.balanceOf(serverList[value].publicKey)
					.call();
				let serverNWT = await nwtContract.methods
					.balanceOf(serverList[value].publicKey)
					.call();
				totalCurrentWT += parseInt(
					web3.utils.fromWei(serverWT, 'ether')
				);
				totalCurrentNWT += parseInt(
					web3.utils.fromWei(serverNWT, 'ether')
				);
				let inputData;
				if (imgInfo === null) {
					inputData = {
						name: serverList[value].name,
						email: serverList[value].email,
						publicKey: serverList[value].publicKey,
						role: serverList[value].role,
						image: undefined,
					};
				} else {
					inputData = {
						name: serverList[value].name,
						email: serverList[value].email,
						publicKey: serverList[value].publicKey,
						role: serverList[value].role,
						image: imgInfo.imgUri,
					};
				}

				if (!(serverList[value].name in inputData)) {
					serverInfo.push(inputData);
				}
			}
			res.json({
				success: true,
				serverInfo,
				totalCurrentWT,
				totalCurrentNWT,
			});
		} catch (err) {
			console.log('DB에서 불러오지 못 함');
			res.json({ success: false, message: '디비에서 불러오지 못 함' });
		}
	},
};
