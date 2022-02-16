require('dotenv').config();
const { User } = require('../models/User');
const { Nft } = require('../models/Nft');
const { Video } = require('../models/Video');
const { Batting } = require('../models/batting');
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');
const Subscriber = require('../models/Subscriber');
const cron = require('node-cron');

const { json } = require('body-parser');

// auth 권한 부여받은 계정(contract 이용가능 => msg.sender : owner)

cron.schedule('*/5 * * * *', async function () {
	// 5분마다 최고 관리자 주소 토큰양 확인해서 바꿔주기
	serverAddress = await targetServerAddress(process.env.SERVERADDRESS);
	serverPrivateKey = await targetAddrPK(serverAddress);
	// console.log(serverAddress, serverPrivateKey);
});

const {
	wtContract,
	nwtContract,
	nftContract,
	swapContract,
	caver,
	serverPrivateKey,
	serverAddress,
} = require('./caver_ContractConnect');

module.exports = {
	KIP_userJoin: async (req, res) => {
		const account = await caver.wallet.keyring.generate();
		caver.klay.accounts.wallet.add( account._key._privateKey);

		console.log(account);

		try {
			const data = await nftContract.methods
				.approveSale(account._address)
				.encodeABI();

			// await caver.klay.accounts.wallet.add(serverPrivateKey);

			const tx = {
				from: serverAddress,
				to: process.env.NFTTOKENCA,
				data: data,
				gas: '300000',
			};

			const signedTx = await caver.klay.accounts.signTransaction(
				tx,
				serverPrivateKey
			);

			// const txHash = await caver.klay.sendSignedTransaction(
			// 	signedTx.rawTransaction
			// );

			await caver.klay
				.sendSignedTransaction(signedTx.rawTransaction)
				.then(function (receipt) {
					// console.log(receipt);
					const userInfo = {
						...req.body,
						publicKey: account._address,
						privateKey: account._key._privateKey,
						nftToken: '',
					};
					const user = new User(userInfo);

					user.save((err, userInfo) => {
						if (err) {
							res.json({ success: false, err });
							return;
						}
						res.status(200).json({
							success: true,
						});
					});
				});
		} catch (e) {
			console.log(e);
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
		console.log(req.user._id);
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
					wtToken: caver.utils.fromPeb(wtAmount, 'KLAY'),
					nwtToken: caver.utils.fromPeb(nwtAmount, 'KLAY'),
				};
				// console.log(userTokens)
				res.json({ success: true, userTokens });
			} catch (err) {
				res.json({
					success: false,
					message: '블록체인 네트워크에 오류가 있음',
				});
			}
		} catch (err) {
			console.log(err);
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
		const nonce = await caver.klay.getTransactionCount(
			serverAddress,
			'latest'
		);

		// 실행할 컨트랙트 함수 데이터
		const data = await wtContract.methods
			.exchange(userPK.publicKey, parseInt(wtAmount))
			.encodeABI();

		const gasprice = await caver.klay.getGasPrice();
		const gasPrice = Math.round(Number(gasprice) + Number(gasprice / 5));
		// transaction
		const tx = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			gas: '300000',
			data: data,
		};

		const signedTx = await caver.klay.accounts.signTransaction(
			tx,
			serverPrivateKey
		);

		try {
			// 블록체인 web3 처리
			await caver.klay
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
		console.log('------ WT <-> NWT ------');
		const nwtAmount = req.body.nwtToken;
		const nwt = parseInt(nwtAmount) / 5;

		const user = await User.findOne({ _id: req.user._id }).exec();

		const nonce1 = await caver.klay.getTransactionCount(
			// user.publicKey,
			serverAddress,
			'latest'
		);

		// const inputWT = web3.utils.toWei(nwtAmount, 'ether');

		const data1 = await wtContract.methods
			.approveToken(user.publicKey, process.env.SWAPCA)
			.encodeABI();

		// const data1 = await wtContract.methods
		// 	.approve(process.env.SWAPCA, inputWT)
		// 	.encodeABI();

		const gasPrice1 = await caver.klay.getGasPrice();

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

		const signedTx1 = await caver.klay.accounts.signTransaction(
			tx1,
			serverPrivateKey
		);

		await caver.klay
			.sendSignedTransaction(signedTx1.rawTransaction)
			.on('receipt', async (txHash) => {
				// console.log(txHash);
				console.log('유저 approve 성공');
				try {
					const nonce2 = await caver.klay.getTransactionCount(
						// user.publicKey,
						serverAddress,
						'latest'
					);

					const data2 = await nwtContract.methods
						.approveToken(serverAddress, process.env.SWAPCA)
						.encodeABI();

					const gasPrice2 = await caver.klay.getGasPrice();

					const tx2 = {
						from: serverAddress,
						to: process.env.NWTTOKENCA,
						nonce: nonce2,
						gasPrice: gasPrice2,
						// gasPrice: gasPrice1,
						gas: 500000,
						data: data2,
					};
					const signedTx2 = await caver.klay.accounts.signTransaction(
						tx2,
						serverPrivateKey
					);
					await caver.klay
						.sendSignedTransaction(signedTx2.rawTransaction)
						.on('receipt', async (txHash) => {
							console.log('유저, 서버 둘다 approve 성공');

							try {
								const nonce3 =
									await caver.klay.getTransactionCount(
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

								const gasPrice3 =
									await caver.klay.getGasPrice();

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
									await caver.klay.accounts.signTransaction(
										tx3,
										serverPrivateKey
									);
								await caver.klay
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
		const nonce = await caver.klay.getTransactionCount(
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
				caver.utils.toWei('100000', 'ether')
				// process.env.NFTTOKENCA //1e18  100000000
			)
			.encodeABI();

		const gasPrice = await caver.klay.getGasPrice();

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
		const signedTx = await caver.klay.accounts.signTransaction(
			tx,
			serverPrivateKey
		);

		try {
			await caver.klay
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

	myPage: async (req, res) => {
		const addr = req.user.publicKey;
		// console.log('here api')
		let wtdata = await wtContract.methods.balanceOf(addr).call();
		let wtData = caver.utils.fromPeb(wtdata, 'KLAY');
		// console.log(wtData);
		let nwtdata = await nwtContract.methods.balanceOf(addr).call();
		let nwtData = caver.utils.fromPeb(nwtdata, 'KLAY');
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
					console.log(nft);
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
				let totalWt = caver.utils.fromWei(dataWT, 'ether'); // 총 발행된 wt tokens

				let dataNWT = await nwtContract.methods.totalSupply().call();
				let totalNwt = caver.utils.fromWei(dataNWT, 'ether'); // 총 발행된 nwt tokens

				let data_server_WT = await wtContract.methods
					.balanceOf(serverAddress) // 관리자 추가 생기면 server.publicKey로 교체
					.call();
				let server_WT = caver.utils.fromWei(data_server_WT, 'ether'); // server wt tokens

				let data_server_NWT = await nwtContract.methods
					.balanceOf(serverAddress) // 관리자 추가 생기면 server.publicKey로 교체
					.call();
				let server_NWT = caver.utils.fromWei(data_server_NWT, 'ether'); // server nwt tokens

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
	KIP_videoUpload: async (req, res) => {
		//await caver.klay.accounts.wallet.add(serverPrivateKey);
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
			
				const tx = {
						from: serverAddress,
						to: process.env.WTTOKENCA,
						data: wtContract.methods
						.createContent()
							.encodeABI(),
						gas: '300000',
					}
				const signedTx = await caver.klay.accounts.signTransaction(tx, serverPrivateKey);
				const txHash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)
				
				console.log(
					'---------- start videoUpload / createRoom finish ------'
				);

				if (txHash) {
					const typesArray = [{ type: 'uint256', name: 'num' }];
					const decodedParameters = caver.klay.abi.decodeParameters(
						typesArray,
						txHash.logs[0].data
					);
					console.log(JSON.stringify(decodedParameters));
					const num = decodedParameters.num-1;

					const video = await Video.find({ title: rawTitle }).exec();
					console.log(video);
					console.log(video[0]._id);
					const batting = new Batting({
						videoId: video[0]._id,
						contentsName: title,
						subTitle: subTitle,
						contentsNum: num,
						serial: Number(serialNo),
					});
					const contents = new Contents({
						contentName: title,
						contentNum: num,
					});
					console.log('content가 개설되었습니다 :', num);
					batting.save((err, info) => {
						contents.save((err, info) => {
							console.log(err);
							if (err) return res.json({ success: false, err });
							console.log(info);
							res.status(200).json({ success: true });
						});
					});
				}

				//실행이 끝나면 DB에 방이 개설됬다고 열어주자.
			});
		} else {
			//이미 새롭게 방이 되어있습니다. serial에 추가시켜주시고 openSerialContent를 true로 활성화시켜주세요
			const video = new Video(req.body);
			video.save(async (err, doc) => {
				//비디오가 save되면서 contentsRoom이란느 함수를 실행시키고
					const tx = {
						from: serverAddress,
						to: process.env.WTTOKENCA,
						data: wtContract.methods
						.openSerialContent(result[0].contentsNum)
						.encodeABI(),
						gas: '300000',
					}
				const signedTx = await caver.klay.accounts.signTransaction(tx, serverPrivateKey);
				const txHash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)
				
				if (txHash) {
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
				}

				// if (err) return res.json({ success: false, err });
				// res.status(200).json({ success: true });
			});
		}
	},

	// server 계정들 가져오기
	// checkAuth : 최고 owner(server) 계정은 무조건 false
	getServerList: async (req, res) => {
		// console.log('api 부분');
		const serverInfo = [];
		let totalCurrentWT = 0;
		let totalCurrentNWT = 0;

		const serverList = await User.find({ role: 1 }).exec();

		try {
			for (value in serverList) {
				let checkOwner = 0;
				let checkAuth = false;
				// db에서 가져오는 server 계정들의 nft
				let imgInfo = await Nft.findOne({
					address: serverList[value].publicKey,
				}).exec();
				// 서버계정의 토큰 보유량
				let serverWT = await wtContract.methods
					.balanceOf(serverList[value].publicKey)
					.call();
				let serverNWT = await nwtContract.methods
					.balanceOf(serverList[value].publicKey)
					.call();
				// token total
				totalCurrentWT += parseInt(
					web3.utils.fromWei(serverWT, 'ether')
				);
				totalCurrentNWT += parseInt(
					web3.utils.fromWei(serverNWT, 'ether')
				);

				checkAuth = await wtContract.methods
					.checkAuth(serverList[value].publicKey)
					.call();

				if (serverList[value].publicKey === serverAddress) {
					checkOwner = 1;
				} else {
					checkOwner = 0;
				}

				// console.log(checkAuth, checkOwner);

				let inputData;
				if (imgInfo === null) {
					inputData = {
						name: serverList[value].name,
						email: serverList[value].email,
						publicKey: serverList[value].publicKey,
						role: serverList[value].role,
						image: undefined,
						checkAuth: checkAuth,
						checkOwner: checkOwner,
					};
				} else {
					inputData = {
						name: serverList[value].name,
						email: serverList[value].email,
						publicKey: serverList[value].publicKey,
						role: serverList[value].role,
						image: imgInfo.imgUri,
						checkAuth: checkAuth,
						checkOwner: checkOwner,
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
	// addAuth
	addAuth: async (req, res) => {
		// console.log('api부분 addA');

		const authAddress = req.body.publicKey;

		// nonce 값
		const nonce1 = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);

		// 실행할 컨트랙트 함수 데이터
		const data1 = await wtContract.methods
			.addAuthorized(authAddress) //1e18  100000000
			.encodeABI();

		const gasPrice1 = await web3.eth.getGasPrice();
		const gasPrice = Math.round(Number(gasPrice1) + Number(gasPrice1 / 10));
		// const gasprice = await web3.eth.getGasPrice();
		// const gasPrice = Math.round(Number(gasprice) + Number(gasprice / 10));

		// transaction
		const tx1 = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce1,
			gasPrice: gasPrice,
			gas: 210000,
			data: data1,
		};

		// transaction 서명
		const signedTx1 = await web3.eth.accounts.signTransaction(
			tx1,
			serverPrivateKey
		);

		try {
			await web3.eth
				.sendSignedTransaction(signedTx1.rawTransaction)
				.on('receipt', async (txHash) => {
					console.log('wtCA는 성공');

					const nonce2 = await web3.eth.getTransactionCount(
						serverAddress,
						'latest'
					);
					// 실행할 컨트랙트 함수 데이터
					const data2 = await nwtContract.methods
						.addAuthorized(authAddress) //1e18  100000000
						.encodeABI();

					const gasPrice2 = await web3.eth.getGasPrice();
					const gasPrice = Math.round(
						Number(gasPrice2) + Number(gasPrice2 / 10)
					);

					// transaction
					const tx2 = {
						from: serverAddress,
						to: process.env.NWTTOKENCA,
						nonce: nonce2,
						gasPrice: gasPrice,
						gas: 210000,
						data: data2,
					};

					// transaction 서명
					const signedTx2 = await web3.eth.accounts.signTransaction(
						tx2,
						serverPrivateKey
					);

					try {
						await web3.eth
							.sendSignedTransaction(signedTx2.rawTransaction)
							.on('receipt', async (txHash) => {
								// console.log(txHash);
								console.log('wt, nwt 까지 들어옴');
								const nonce3 =
									await web3.eth.getTransactionCount(
										serverAddress,
										'latest'
									);
								// 실행할 컨트랙트 함수 데이터
								const data3 = await nftContract.methods
									.addAuthorized(authAddress) //1e18  100000000
									.encodeABI();

								const gasPrice3 = await web3.eth.getGasPrice();
								const gasPrice = Math.round(
									Number(gasPrice3) + Number(gasPrice3 / 10)
								);

								// transaction
								const tx3 = {
									from: serverAddress,
									to: process.env.NFTTOKENCA,
									nonce: nonce3,
									gasPrice: gasPrice,
									gas: 210000,
									data: data3,
								};

								// transaction 서명
								const signedTx3 =
									await web3.eth.accounts.signTransaction(
										tx3,
										serverPrivateKey
									);

								try {
									await web3.eth
										.sendSignedTransaction(
											signedTx3.rawTransaction
										)
										.on('receipt', async (txHash) => {
											console.log(
												'wt, nwt, nft 싹다 권한 부여',
												txHash
											);

											const data =
												await nftContract.methods
													.approveSale(authAddress)
													.encodeABI();
											const nonce =
												await web3.eth.getTransactionCount(
													serverAddress,
													'latest'
												);
											const gasprice =
												await web3.eth.getGasPrice();
											const gasPrice = Math.round(
												Number(gasprice) +
													Number(gasprice / 10)
											);

											const tx = {
												from: serverAddress,
												to: process.env.NFTTOKENCA,
												nonce: nonce,
												gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
												gasLimit: 5000000,
												data: data,
											};

											const signedTx =
												await web3.eth.accounts.signTransaction(
													tx,
													serverPrivateKey
												);
											const hash = await web3.eth
												.sendSignedTransaction(
													signedTx.rawTransaction
												)
												.on('receipt', (txHash) => {
													res.json({
														success: true,
														message:
															'권한 부여 성공',
													});
												});

											// res.json({
											// 	success: true,
											// 	message: '권한 부여 성공',
											// });
										});
								} catch (err) {
									console.log(
										'nft 컨트랙트 권한주는 중에 오류가 생김',
										err
									);
									res.json({
										success: false,
										message: '권한 부여 실패',
									});
								}
							});
					} catch (err) {
						console.log(
							'nwt 컨트랙트 권한주는 중에 오류가 생김',
							err
						);
						res.json({
							success: false,
							message: '권한 부여 실패',
						});
					}
				});
		} catch (err) {
			console.log('wt 컨트랙트 권한주는 중에 오류가 생김', err);
			res.json({
				success: false,
				message: '권한 부여 실패',
			});
		}
	},
	//removeAuth
	removeAuth: async (req, res) => {
		// console.log('api부분');
		const authAddress = req.body.publicKey;

		// nonce 값
		const nonce1 = await web3.eth.getTransactionCount(
			serverAddress,
			'latest'
		);

		// 실행할 컨트랙트 함수 데이터
		const data1 = await wtContract.methods
			.removeAuthorized(authAddress) //1e18  100000000
			.encodeABI();

		const gasPrice1 = await web3.eth.getGasPrice();
		const gasPrice = Math.round(Number(gasPrice1) + Number(gasPrice1 / 10));

		// transaction
		const tx1 = {
			from: serverAddress,
			to: process.env.WTTOKENCA,
			nonce: nonce1,
			gasPrice: gasPrice,
			gas: 210000,
			data: data1,
		};

		// transaction 서명
		const signedTx1 = await web3.eth.accounts.signTransaction(
			tx1,
			serverPrivateKey
		);

		try {
			await web3.eth
				.sendSignedTransaction(signedTx1.rawTransaction)
				.on('receipt', async (txHash) => {
					console.log('wtCA는 성공');

					const nonce2 = await web3.eth.getTransactionCount(
						serverAddress,
						'latest'
					);
					// 실행할 컨트랙트 함수 데이터
					const data2 = await nwtContract.methods
						.removeAuthorized(authAddress) //1e18  100000000
						.encodeABI();

					const gasPrice2 = await web3.eth.getGasPrice();
					const gasPrice = Math.round(
						Number(gasPrice2) + Number(gasPrice2 / 10)
					);

					// transaction
					const tx2 = {
						from: serverAddress,
						to: process.env.NWTTOKENCA,
						nonce: nonce2,
						gasPrice: gasPrice,
						gas: 210000,
						data: data2,
					};

					// transaction 서명
					const signedTx2 = await web3.eth.accounts.signTransaction(
						tx2,
						serverPrivateKey
					);

					try {
						await web3.eth
							.sendSignedTransaction(signedTx2.rawTransaction)
							.on('receipt', async (txHash) => {
								console.log('wt, nwt 까지 들어옴');
								const nonce3 =
									await web3.eth.getTransactionCount(
										serverAddress,
										'latest'
									);
								// 실행할 컨트랙트 함수 데이터
								const data3 = await nftContract.methods
									.removeAuthorized(authAddress) //1e18  100000000
									.encodeABI();

								const gasPrice3 = await web3.eth.getGasPrice();
								const gasPrice = Math.round(
									Number(gasPrice3) + Number(gasPrice3 / 10)
								);

								// transaction
								const tx3 = {
									from: serverAddress,
									to: process.env.NFTTOKENCA,
									nonce: nonce3,
									gasPrice: gasPrice,
									gas: 210000,
									data: data3,
								};

								// transaction 서명
								const signedTx3 =
									await web3.eth.accounts.signTransaction(
										tx3,
										serverPrivateKey
									);

								try {
									await web3.eth
										.sendSignedTransaction(
											signedTx3.rawTransaction
										)
										.on('receipt', async (txHash) => {
											console.log(
												'wt, nwt, nft 싹다 권한 부여',
												txHash
											);
											res.json({
												success: true,
												message: '권한 부여 성공',
											});
										});
								} catch (err) {
									console.log(
										'nft 컨트랙트 권한주는 중에 오류가 생김',
										err
									);
									res.json({
										success: false,
										message: '권한 부여 실패',
									});
								}
							});
					} catch (err) {
						console.log(
							'nwt 컨트랙트 권한주는 중에 오류가 생김',
							err
						);
						res.json({
							success: false,
							message: '권한 부여 실패',
						});
					}
				});
		} catch (err) {
			console.log('wt 컨트랙트 권한주는 중에 오류가 생김', err);
			res.json({
				success: false,
				message: '권한 부여 실패',
			});
		}
	},

	searchChannelPage: async (req, res) => {
		console.log('???', req.body);

		const userInfo = await User.find().find({
			name: { $regex: req.body.name, $options: 'i' },
		});

		console.log('user?', userInfo[0]._id);

		Video.find({ writer: userInfo[0]._id }, (err, content) => {
			const contentInfo = content;

			Subscriber.find({ userTo: userInfo[0]._id }).exec(
				(err, subscribe) => {
					if (contentInfo[0] !== null) {
						res.status(201).json({
							success: true,
							contentdata: contentInfo,
							userdata: userInfo,
							subscribeNumber: subscribe.length,
							type: 'result',
						});
					} else {
						res.json({ success: false });
					}
				}
			);

			// console.log("????", contentInfo);
			// console.log("?", userInfo);
		});

		// Video.find({writer: user[0]._id}), (err, video) => {
		// 	console.log("video", video);
		// 	if (video[0]) {
		// 		res.status(201).json({
		// 			success: true,
		// 			videodata: video,
		// 			userdata: user,
		// 		});

		// 	} else {
		// 		res.json({ success: false });
		// 	}
		// }
	},
};
