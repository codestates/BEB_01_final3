require('dotenv').config();
const { User } = require('../models/User');
const { Nft } = require('../models/Nft');
const { Video } = require('../models/Video');

const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);
const fs = require('fs');
const { newContract } = require('./index');

//계정부분
const serverAddress = process.env.SERVERADDRESS;
const serverPrivateKey = process.env.SERVERPRIVATEKEY;

// abi json
const WTABI = fs.readFileSync('server/abi/WTToken.json', 'utf-8');
const NWTABI = fs.readFileSync('server/abi/NWTToken.json', 'utf-8');
const NFTABI = fs.readFileSync('server/abi/NFTWT.json', 'utf8');
const SWAPABI = fs.readFileSync('server/abi/TokenSwap.json', 'utf-8');

// abi parse
const nftAbi = JSON.parse(NFTABI);
const wtAbi = JSON.parse(WTABI);
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
			const sendAccount = process.env.serverAddress;
			const privateKey = process.env.serverAddress_PK;
			const data = await nftContract.methods
				.approveSale(account.address)
				.encodeABI();
			const nonce = await web3.eth.getTransactionCount(
				sendAccount,
				'latest'
			);

			const tx = {
				from: sendAccount,
				to: process.env.NFTTOKENCA,
				nonce: nonce,
				gas: 5000000,
				data: data,
			};

			const signedTx = await web3.eth.accounts.signTransaction(
				tx,
				privateKey
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
	userTokens: (req, res) => {
		try {
			User.findOne({ _id: req.user._id }, (err, user) => {
				const userTokens = {
					wtToken: user.wtToken,
					nwtToken: user.nwtToken,
				};
				res.json(userTokens);
			});
		} catch (err) {
			res.json({ success: false, err });
		}
	},

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

		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce,
			gas: 5000000,
			data: data,
		};

		const signedTx = await web3.eth.accounts.signTransaction(
			tx,
			serverPrivateKey
		);

		await web3.eth
			.sendSignedTransaction(signedTx.rawTransaction) // sendTranscation
			.on('receipt', (txHash) => {
				// console.log(txHash);
				try {
					User.findOne(
						// user DB 에서 서버의 데이터 찾아서
						{ publicKey: serverAddress },
						(err, server) => {
							// console.log(server.wtToken);
							if (server.wtToken >= wt) {
								User.findOneAndUpdate(
									// 현재 로그인 되어있는 유저의 wtToken 양 증가
									{ _id: req.user._id },
									{ $inc: { wtToken: wt } },
									(err, user) => {
										console.log(user);
										console.log('user 토큰 지급');
									}
								);
								User.findOneAndUpdate(
									// 서버의 wtToken 양 감소
									{ publicKey: serverAddress },
									{ $inc: { wtToken: -wt } },
									(err, server) => {
										console.log(server);
										console.log('server 토큰 감소');
									}
								);

								res.json({ success: true });
							} else {
								// server 계정 minting 하고
								// 오류 넘김
								res.json({ success: false, err });
							}
						}
					);
				} catch (err) {
					res.json({ success: false, err });
				}
				// res.json({ success: true });
			}); // transaction error ㅊㅓ리해주기
	},

	// WT <-> NWT
	exchange_NWTToken: async (req, res) => {
		const nwtAmount = req.body.nwtToken; // 가격에 대한 wt token 개수
		const nwt = parseInt(nwtAmount) / 5;
		// console.log(nwtAmount, nwt);

		const inputWT = web3.utils.toWei(nwtAmount, 'ether'); // user가 nwt로 바꿀 wt 양
		const outputNWT = web3.utils.toWei(String(nwt), 'ether'); // server가 wt로 바꿔줄 nwt 양

		const userPK = await User.findOne({ _id: req.user._id }).exec(); // user의 정보

		// nonce 값
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);
		// 실행할 컨트랙트 함수 데이터
		const data = await wtContract.methods
			.approve(process.env.SWAPCA, inputWT)
			.encodeABI();

		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce,
			gas: 5000000,
			data: data,
		};

		// 서명 트랜잭션
		const signedTx = await web3.eth.accounts.signTransaction(
			tx,
			serverPrivateKey
			// userPK.privateKey
		);

		try {
			await web3.eth
				.sendSignedTransaction(signedTx.rawTransaction)
				.on('receipt', async (txHash) => {
					try {
						const allow = await wtContract.methods.allowance(
							userPK.publicKey,
							process.env.SWAPCA
						);
						console.log(allow);
					} catch (err) {
						console.log(err);
					}
				});
		} catch (err) {
			console.log(err);
		}
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

		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce,
			gas: 500000,
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
					User.findOneAndUpdate(
						{ publicKey: serverAddress },
						{ $inc: { wtToken: 1000000 } },
						(err, user) => {
							console.log(user);
						}
					);
					json.res({ success: true });
				});
		} catch (err) {
			console.log(err);
		}
	},

	// server nwt token faucet
	serverNWT_faucet: async (req, res) => {
		console.log('aa');
	},
	NFTlist: (req, res) => {
		console.log('list');
		Nft.find({ sale: true }, (err, result) => {
			res.json({ data: result });
		});
	},
	createNFT: async (req, res) => {
		const {
			userId,
			contentTitle,
			nftName,
			nftDescription,
			imgURI,
			tokenURI,
			price,
		} = req.body.result;
		try {
		var regexp = /^[0-9]*$/
		if (!regexp.test(price)) {
			console.log(1);
			res.json({ failed: false, reason: '정확한 가격을 작성해주세요!!' });
		}

		const data = await nftContract.methods
			.mintNFT(tokenURI, web3.utils.toWei(price, 'ether'))
			.encodeABI();
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);
		const gasPrice = await web3.eth.getGasPrice();
		console.log(gasPrice);
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			nonce: nonce,
			gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
            gasLimit: 210000,   
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
			console.log(tokenId);
			const nft = new Nft();
			nft.address = serverAddress;
			nft.tokenId = tokenId;
			nft.contentTitle = contentTitle;
			nft.nftName = nftName;
			nft.description = nftDescription;
			nft.imgUri = imgURI;
			nft.tokenUrl = tokenURI;
			nft.price = price;

			nft.save((err, userInfo) => {
				if (!err) {
					console.log(2);
					res.json({ success: true });
				} else {
					console.log(3);
					res.json({ failed: false,reason: '블록체인에는 올라갔지만 DB에 문제가 생겼습니다.' });
				}
			});
		} catch (e) {
			console.log('err' + e);
			console.log(4);
			res.json({ failed: false,reason: '블록체인에 문제가있습니다'  });
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

		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			nonce: nonce,
			gas: 5000000,
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

	myPage: (req, res) => {
		// console.log('here api')
		try {
			// 현재 로그인된 user 정보 찾아서
			User.findOne({ _id: req.user._id }, (err, user) => {
				// userInfo 에 필요한 정보 담고
				const userInfo = {
					publicKey: user.publicKey,
					privateKey: user.privateKey,
					wtToken: user.wtToken,
					nwtToken: user.nwtToken,
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
		console.log(tokenId);
		const sellPrice = req.body.sellPrice;
		const data = await nftContract.methods
			.setForSale(tokenId, web3.utils.toWei(sellPrice, 'ether'))
			.encodeABI();
		const nonce = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			nonce: nonce,
			gas: 5000000,
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

					Nft.findOneAndUpdate(
						{ tokenId: tokenId },
						{ sale: true },
						(err, result) => {
							console.log('DB success');
							res.json({
								success: true,
								detail: 'db store success and block update success',
							});
							if (err) console.log(err);
						}
					);
				});
		} catch (e) {
			console.log(e);
			res.json({ failed: false });
		}
	},
	ownerOf: async (req, res) => {
		const owner = await nftContract.methods.ownerOf('85').call();

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

		res.status(201).json({ success: true, data: nftInfo, type: 'nft' });
		// if(err){
		//     res.status(404).json({failed:false})
		// }
		console.log('nft', nftInfo);
	},

	SearchContent: async (req, res) => {
		let name = req.body.name;

		console.log('name?',name);

		const contentInfo = await Video.find().find({
			title: { $regex: name, $options: 'i' },
		});
		res.status(201).json({ success: true, data: contentInfo, type: 'Content' });
		// if(err){
		//     res.status(404).json({failed:false})
		// }
		console.log('api.content', contentInfo);
	},
};
