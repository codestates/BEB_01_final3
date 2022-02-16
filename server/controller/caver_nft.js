require('dotenv').config();
const { User } = require('../models/User');
const { Nft } = require('../models/Nft');
const { Video } = require('../models/Video');
const { Batting } = require('../models/batting');
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');


const { wtContract, nwtContract, nftContract, swapContract, caver, serverPrivateKey, serverAddress } = require('./caver_ContractConnect');
const { json } = require('body-parser');

//계정부분

// auth 권한 부여받은 계정(contract 이용가능 => msg.sender : owner)
const subManagerAddress = '';


module.exports = {
	NFTlist: (req, res) => {
		// console.log("??", req);
		Nft.find({ sale: true, type: req.body.type }, (err, result) => {
			console.log(result);
			res.json({ data: result });
		});
	},
	createNFT: async (req, res) => {
		//===================  server 계정 변환 테스트
		// const loginServer = req.user.publicKey;
		// serverAddress = await changeAuther(serverAddress, loginServer);
		// if (serverAddress === loginServer) {
		// 	serverPrivateKey = req.user.privateKey;
		// }
		// await caver.klay.accounts.wallet.add(serverPrivateKey);
		//===================  server 계정 변환 테스트
		const { contentTitle, nftName, nftDescription, imgURI, tokenURI } =
			req.body.result;
		try {
			
			const data = await nftContract.methods
				.mintNFT(tokenURI)
				.encodeABI();
			const tx = {
				from: serverAddress,
				to: process.env.NFTTOKENCA,
				data : data,
				gas: 300000,
			}
			const signedTx = await caver.klay.accounts.signTransaction(tx, serverPrivateKey)
			const txHash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)

				const tokenId = caver.utils.hexToNumber(txHash.logs[0].topics[3]);
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
						res.json({ success: true });
					} else {
						res.json({
							failed: false,
							reason: '블록체인에는 올라갔지만 DB에 문제가 생겼습니다.',
						});
					}
				});
		} catch (e) {
			console.log('err' + e);
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
			console.log('owner is not buy');
			res.json({ failed: false, reason: 'owner is not buy ' });
			return;
		}
		try {
			//approveToken 함수 작성
			const data = await nwtContract.methods
				.approveToken(buyer, process.env.NFTTOKENCA)
				.encodeABI();
			const tx = {
				from: serverAddress,
				to: process.env.NWTTOKENCA,
				gas: 300000,
				data: data,
			};
			const signedTx = await caver.klay.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			console.log('-----NFT Aprove function end ----');
			const approveHash = await caver.klay.sendSignedTransaction(
				signedTx.rawTransaction
			);
			if (approveHash) {
				//approveToken 함수 작성 끝

				const data = await nftContract.methods
					.purchaseToken(tokenId, buyer)
					.encodeABI();
				
				const tx = {
					from: serverAddress,
					to: process.env.NFTTOKENCA,
					gas: 300000,
					data: data,
				};

				const signedTx = await caver.klay.accounts.signTransaction(
					tx,
					serverPrivateKey
				);
				console.log('----- purchaseToken function start ----');
				const sellHash = await caver.klay.sendSignedTransaction(
					signedTx.rawTransaction
				);

				if (sellHash) {
					const owner = await nftContract.methods
						.ownerOf(tokenId)
						.call();
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
			res.json({
				fail: false,
				detail: '정확한 가격을 작성해주세요!!',
			});
			return;
		}

		if (owner !== dbOwner[0].address) {
			res.json({
				fail: false,
				detail: '소유자가 다르다, 확인바람',
			});
		}

		console.log('sell', tokenId, privateKey, sellPrice);
		const data = await nftContract.methods
			.setForSale(tokenId, caver.utils.toPeb(sellPrice, 'KLAY'))
			.encodeABI();
		
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			gas: 300000,
			data: data,
		};

		try {
			const signedTx = await caver.klay.accounts.signTransaction(
				tx,
				serverPrivateKey
			);
			console.log('----- setForSale function start ----');
			const hash = await caver.klay.sendSignedTransaction(
				signedTx.rawTransaction
			);

			if (hash) {
				//프로필이랑 팔려고하는 사진이랑 다른 경우
				if (privateKey === undefined) {
					Nft.findOneAndUpdate(
						{ tokenId: tokenId },
						{ sale: true, price: sellPrice, type: 'fixed' },
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
						{ tokenId: tokenId },
						{ sale: true, price: sellPrice, type: 'fixed' },
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
			}
		} catch (e) {
			console.log(e);
		}
	},

	nftauction: async (req, res) => {
		
		const tokenId = req.body.tokenId;
		const privateKey = req.body.privateKey;
		const Auctionsell = req.body.Auctionsell;
		const publickey = req.body.publicKey;
		// const userInfo = await User.findOne({ email: email }).exec();
		// const publicKey = userInfo.publicKey;
		console.log('nft', tokenId, privateKey, publickey, Auctionsell);
		//가격에 숫자이외의 문자가 들어오지 않게 하기위한 정규식
		var regexp = /^[0-9]*$/;
		if (!regexp.test(Auctionsell)) {
			console.log(1);
			res.json({
				fail: false,
				detail: '정확한 가격을 작성해주세요!!',
			});
		}
		// approve 함수 추가
		// 1. 프론트에서 경매 시작 버튼 클릭
		// 2. if address == serverAdress
		// 3. approve(NFTCont, tokenId), tx ={from : serverAdd}
		// 4. else 
		// 5. approve(NFTCont, tokenId), tx = {from : userAdd}
		if( serverAddress == publickey) {
			const data = await nftContract.methods
				.approve(
					process.env.NFTTOKENCA,
					tokenId
				)
				.encodeABI();
			const approvetx = {
				from: serverAddress,
				to: process.env.NFTTOKENCA,
				gas: 300000,
				data: data
			}
			console.log('---------approve start-----------');
			try{
				const signedTx = await caver.klay.accounts.signTransaction(
					approvetx,
					serverPrivateKey
				);
				const approvehash = await caver.klay.sendSignedTransaction(
					signedTx.rawTransaction
				)

			console.log('---------approve success-----------');
				if(approvehash){
					const data = await nftContract.methods
						.startAuction(
							tokenId,
							publickey,
							caver.utils.toPeb(Auctionsell, 'KLAY')
						)
						.encodeABI();
					const tx = {
							from: serverAddress,
							to: process.env.NFTTOKENCA,
							gas: 300000,
							data: data,
						};
					console.log('----- auction function start ----');
					const signedTx = await caver.klay.accounts.signTransaction(
						tx,
						serverPrivateKey
					);
					console.log('----- sign end -----');
					const hash = await caver.klay.sendSignedTransaction(
						signedTx.rawTransaction
					);
					console.log(hash);
					console.log('----- sign send end -----');
					if (hash) {
						if (privateKey !== undefined) {
							Nft.findOneAndUpdate(
								{ tokenId: tokenId },
								{
									spender: process.env.NFTTOKENCA,
									sale: true,
									price: Auctionsell,
									type: 'Auction',
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
						} else {
							Nft.findOneAndUpdate(
								{ tokenId: tokenId },
								{
									spender: process.env.NFTTOKENCA,
									sale: true,
									price: Auctionsell,
									type: 'Auction',
								},
								(err, result) => {
									console.log('DB success');
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
				}

			}catch (e) {
				console.log(e);
				res.json({ failed: false });
			}
		}else{
			const data = await nftContract.methods
				.approve(
					process.env.NFTTOKENCA,
					tokenId
				)
				.encodeABI();
			const approvetx = {
				from: publickey,
				to: process.env.NFTTOKENCA,
				gas: 300000,
				data: data
			}
			console.log('---------approve success-----------');
			try{
				const signedTx = await caver.klay.accounts.signTransaction(
					approvetx,
					serverPrivateKey
				);
				const feePay = await caver.klay.accounts.feePayerSignTransaction(
					signedTx.rawTransaction, 
					serverAddress, 
					serverPrivateKey);
				const approvehash = await caver.klay.sendSignedTransaction(
					feePay.rawTransaction
				);
				if(approvehash){
					const data = await nftContract.methods
						.startAuction(
							tokenId,
							publickey,
							caver.utils.toPeb(Auctionsell, 'KLAY')
						)
						.encodeABI();
					const tx = {
							from: serverAddress,
							to: process.env.NFTTOKENCA,
							gas: 300000,
							data: data,
						};
					console.log('----- auction function start ----');
					const signedTx = await caver.klay.accounts.signTransaction(
						tx,
						serverPrivateKey
					);
					console.log('----- sign end -----');

					const feePay = await caver.klay.accounts.feePayerSignTransaction(
						signedTx.rawTransaction, 
						serverAddress, 
						serverPrivateKey);

					const hash = await caver.klay.sendSignedTransaction(
						feePay.rawTransaction
					);
					console.log(hash);
					console.log('----- sign send end -----');
					if (hash) {
						if (privateKey !== undefined) {
							Nft.findOneAndUpdate(
								{ tokenId: tokenId },
								{
									spender: process.env.NFTTOKENCA,
									sale: true,
									price: Auctionsell,
									type: 'Auction',
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
						} else {
							Nft.findOneAndUpdate(
								{ tokenId: tokenId },
								{
									spender: process.env.NFTTOKENCA,
									sale: true,
									price: Auctionsell,
									type: 'Auction',
								},
								(err, result) => {
									console.log('DB success');
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
				}

			}catch (e) {
				console.log(e);
				res.json({ failed: false });
			}
		}
	},

	bids: async (req, res) => {
		// ----- 구매자 정보  ------- //
		const buyerInfo = await User.findOne({ _id: req.user._id }).exec();
		const buyer = buyerInfo.publicKey;
		const buyerPrivate = buyerInfo.privateKey;
		// ----- auction info  ------- //
		const tokenId = req.body.tokenId;
		const ownerInfo = await Nft.findOne({ tokenId: tokenId }).exec();
		const owner = ownerInfo.address;
		const spender = ownerInfo.spender;
		const Bowner = await nftContract.methods.ownerOf(tokenId).call();
		const bidPrice = req.body.bids;
		const beforeBuyer = req.body.beforeBuyer;
		const beforePrice = req.body.beforePrice;

		console.log(Bowner);
		console.log(tokenId);

		if (spender !== Bowner) {
			console.log('auction 함수에 이상이 생겼습니다.');
			return res.json({ success: false });
		} else if (bidPrice <= beforePrice) {
			console.log('제시금액이 너무 적다. 다시 측정해주라!');
			return res.json({
				success: false,
				detail: ' Your Price is to Low',
			});
		}
		const bidInfo = (owner, bidAddress, bid, biddest, bidding, Tx) => {
			return { owner, bidAddress, bid, biddest, bidding, Tx };
		};

		//전에 배팅했던 인원에 대해서 정보를 변경시켜준다.

		if (owner === buyer) {
			console.log('owner is not buy');
			return res.json({ success: false, detail: 'Owner is not buy' });
		}
		try {
			//approveToken 함수 작성
			const data = await nwtContract.methods
				.approveToken(buyer, process.env.NFTTOKENCA)
				.encodeABI();
			
			const tx = {
				type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
				from: buyer,
				to: process.env.NWTTOKENCA,
				gas: 300000,
				data: data,
			};
			const signedTx = await caver.klay.accounts.signTransaction(
				tx,
				buyerPrivate
			);
			const feePay = await caver.klay.accounts.feePayerSignTransaction(
				signedTx.rawTransaction, 
				serverAddress, 
				serverPrivateKey);

			console.log('----- bids function start ----');
			const approveHash = await caver.klay.sendSignedTransaction(
				feePay.rawTransaction
			);
			if (approveHash) {
				//approveToken 함수 작성 끝

				const data = await nftContract.methods
					.bid(tokenId, buyer, caver.utils.toPeb(bidPrice, 'KLAY'))
					.encodeABI();
				
				const tx = {
					type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
					from: buyer,
					to: process.env.NFTTOKENCA,
					gas: 300000,
					data: data,
				};

				const signedTx = await caver.klay.accounts.signTransaction(
					tx,
					buyerPrivate
				);
				const feePay = await caver.klay.accounts.feePayerSignTransaction(
					signedTx.rawTransaction, 
					serverAddress, 
					serverPrivateKey);

				console.log('----- sign end -----');
				const sellHash = await caver.klay.sendSignedTransaction(
					feePay.rawTransaction
				);
				console.log('----- sign send end -----');
				if (sellHash) {
					const bid = bidInfo(
						owner,
						buyer,
						bidPrice,
						true,
						true,
						sellHash.logs[0].transactionHash
					);
					await Nft.updateOne(
						{ tokenId, 'bids.bidAddress': beforeBuyer },
						{ $set: { 'bids.$.biddest': false } }
					).exec();
					Nft.findOneAndUpdate(
						{ tokenId: tokenId },
						{ $push: { bids: bid } },
						(err, result) => {
							console.log('autcion is normal, Do not Worry');
							res.json({
								success: true,
								detail: 'success set highstbid',
							});
							if (err) console.log(err);
						}
					);
				}
			}
		} catch (e) {
			console.log(e);
			res.json({ failed: false });
		}
	},

	withdraw: async (req, res) => {
		const tokenId = req.body.tokenId;
		const email = req.user.email;
		const userInfo = await User.findOne({ email: email }).exec();
		const withdrawer = userInfo.publicKey;
		const withdrawerPrivate = userInfo.privateKey

		const data = await nwtContract.methods
			.approveToken(process.env.NFTTOKENCA, process.env.NFTTOKENCA)
			.encodeABI();
	
		const tx = {
			type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
			from: withdrawer,
			to: process.env.NWTTOKENCA,
			gas: 300000,
			data: data,
		};
		const signedTx = await caver.klay.accounts.signTransaction(
			tx,
			withdrawerPrivate
		);
		const feePay = await caver.klay.accounts.feePayerSignTransaction(
			signedTx.rawTransaction, 
			serverAddress, 
			serverPrivateKey);

		console.log('----- withdraw function start ----');
		const approveHash = await caver.klay.sendSignedTransaction(
			feePay.rawTransaction
		);
		if (approveHash) {
			const data = await nftContract.methods
				.withdraw(withdrawer, tokenId)
				.encodeABI();
			
			const tx = {
				type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
				from: withdrawer,
				to: process.env.NFTTOKENCA,
				gas: 300000,
				data: data,
			};

			const signedTx = await caver.klay.accounts.signTransaction(
				tx,
				withdrawerPrivate
			);
			const feePay = await caver.klay.accounts.feePayerSignTransaction(
				signedTx.rawTransaction, 
				serverAddress, 
				serverPrivateKey);

			console.log('----- sign end ----');
			const sellHash = await caver.klay.sendSignedTransaction(
				feePay.rawTransaction
			);
			console.log(sellHash);
			console.log('----- sign send end ----');
		}
	},
	endauction: async (req, res) => {
		const tokenId = req.body.tokenId;
		const email = req.user.email;
		const userInfo = await User.findOne({ email: email }).exec();
		const ownerPublic = userInfo.publicKey;
		const ownerPrivate = userInfo.privateKey
		const data = await nwtContract.methods
			.approveToken(process.env.NFTTOKENCA, process.env.NFTTOKENCA)
			.encodeABI();
		
		const tx = {
			type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
			from: ownerPublic,
			to: process.env.NWTTOKENCA,
			gas: 300000,
			data: data,
		};
		const signedTx = await caver.klay.accounts.signTransaction(
			tx,
			ownerPrivate
		);
		const feePay = await caver.klay.accounts.feePayerSignTransaction(
			signedTx.rawTransaction, 
			serverAddress, 
			serverPrivateKey);
		console.log('----- purchaseToken function start ----');
		const approveHash = await caver.klay.sendSignedTransaction(
			feePay.rawTransaction
		);
		if (approveHash) {
			const data = await nftContract.methods
				.approveSale(process.env.NFTTOKENCA)
				.encodeABI();
			
			const tx = {
				type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
				from: ownerPublic,
				to: process.env.NFTTOKENCA,
				gas: 300000,
				data: data,
			};
			const signedTx = await caver.klay.accounts.signTransaction(
				tx,
				ownerPrivate
			);
			const feePay = await caver.klay.accounts.feePayerSignTransaction(
				signedTx.rawTransaction, 
				serverAddress, 
				serverPrivateKey);
			console.log('----- EndAuction function start ----');
			const endHash = await caver.klay.sendSignedTransaction(
				feePay.rawTransaction
			);
			if (endHash) {
				const data = await nftContract.methods.end(tokenId).encodeABI();
				
				const tx = {
					type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
					from: ownerPublic,
					to: process.env.NFTTOKENCA,
					gas: 300000,
					data: data,
				};

				const signedTx = await caver.klay.accounts.signTransaction(
					tx,
					ownerPrivate
				);
				const feePay = await caver.klay.accounts.feePayerSignTransaction(
					signedTx.rawTransaction, 
					serverAddress, 
					serverPrivateKey);
				console.log('----- sign end ----');
				const sellHash = await caver.klay.sendSignedTransaction(
					feePay.rawTransaction
				);

				console.log('----- sign send end ----');
				if (sellHash) {
					Nft.findOneAndUpdate(
						{ tokenId: tokenId },
						{ sale: false },
						(err, result) => {
							console.log('DB success');
							res.json({
								success: true,
								detail: 'success auction end',
							});
							if (err) console.log(err);
						}
					);
				}
			}
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
		
		const tx = {
			from: serverAddress,
			to: process.env.NFTTOKENCA,
			gas: 300000,
			data: data,
		};

		const signedTx = await caver.klay.accounts.signTransaction(
			tx,
			serverPrivateKey
		);
		console.log('----- setToken function start ----');
		const hash = await caver.klay.sendSignedTransaction(
			signedTx.rawTransaction
		);

		if (hash) {
			res.json({ success: true });
		}
	},
};
