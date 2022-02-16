require('dotenv').config();
const fs = require('fs');
const { User } = require('../models/User');
const { Nft } = require('../models/Nft');
const { Video } = require('../models/Video');
const { Batting } = require('../models/batting');
const { Contents } = require('../models/Contents');
const { Vote } = require('../models/Vote');

//계정부분
// auth 권한 부여받은 계정(contract 이용가능 => msg.sender : owner)
const subManagerAddress = '';


const { wtContract, nwtContract, nftContract, swapContract, caver, serverPrivateKey, serverAddress } = require('./caver_ContractConnect');

module.exports = {
	KIP_vote: async (req, res) => {

       //대납 계정자 feePayer
		//const feePayer = caver.klay.accounts.wallet.add('0x{private key}')
		const sender = req.user.publicKey
		const senderPk = '0xf830e4e084e3c6ce30a065ed17565d24a0e88fd331ce8261354e8455e93656a9';

		//투표한 기록이 있는지 확인해주는 유효성검사 물론 블록체인에서도 검사하지만 두번유효성검사를 해줌으로써 안전에 기여하자.
		
		const duplicate = await Vote.findOne({
			contentName: req.body.title,
			userAddress: req.user.publicKey,
		}).exec();
		console.log(duplicate);
		if (duplicate === null) {
			return res.json({
				fail: false,
				detail: '이미 투표를 완료했습니다.',
			});
		} else {
			//approveToken 함수 작성
		
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

					console.log(info.contentNum,info.select,"제발",sender);
					const data = await wtContract.methods
						.vote(info.contentNum, info.select)
						.encodeABI();
					
			const tx = {
				//type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
				from: sender,
				to: process.env.WTTOKENCA,
				data: data,
				gas: '300000',
			}
		//user is signed			
		const signedTx = await caver.klay.accounts.signTransaction(tx, senderPk);
		//feePayer is signed
		// const feePayerSigned = await caver.klay.accounts.feePayerSignTransaction(signedTx.rawTransaction, serverAddress, serverPrivateKey);
		const hash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)
	    // console.log(feePayerSigned);
		//const txHash = await caver.klay.sendSignedTransaction(feePayerSigned.rawTransaction)
          
					
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

					const decodedParameters = caver.klay.abi.decodeParameters(
						typesArray,
						hash.logs[0].data
					);
					console.log(JSON.stringify(decodedParameters));
					const num = decodedParameters.roomNumber;
					console.log(num);

					// const vote = new Vote(info);
					// vote.save((err, info) => {
					// 	console.log('db저장성공', info);
					// 	res.json({ success: true, detail: 'success db store' });

					// 	if (err) {
					// 		return res.json({
					// 			fail: false,
					// 			detail: 'failed store db',
					// 		});
					// 	}
					// });
				} catch (e) {
					console.log('blockChain ERR : ' + e);
					res.json({ fail: false, detail: 'failed blockChain' });
				}
			
		}
	},
	KIP_contentList: async (req, res) => {
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
	KIP_allowance: async (req, res) => {

		 const user = "0x3018198475bD0888D2F74004905232074c2c63f1";

		// const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
		// 	    type :'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
		// 		from : serverAddress,
		// 		to : process.env.WTTOKENCA,
		// 		data : wtContract.methods.mintToken(user,caver.utils.toPeb('30','KLAY')).encodeABI(),
		// 		gas : '3000000',
		// 	}, serverPrivateKey)	
		
		// console.log('------------------------------');
		// //console.log(rawTransaction);
		// 	caver.klay.sendTransaction({
		// 		senderRawTransaction: senderRawTransaction,
		// 		feePayer : serverAddress
		// 	  })
		// 	  .then((receipt)=>{
		// 		  if(receipt.transactionHash){
					
		// 			  console.log("성공!");
					  
		// 		  }
		// 	  })

		// const bal = await wtContract.methods.balanceOf(user).call();
		// console.log(bal);
			

		// const data = await wtContract.methods
		// 	.mintToken(user, 1000000000000000)
		// 	.encodeABI();
		// const nonce = await caver.klay.getTransactionCount(
		// 	serverAddress,
		// 	'latest'
		// );
		// const gasprice = await caver.klay.getGasPrice();
		// const gasPrice = Math.round(
		// 	Number(gasprice) + Number(gasprice / 10)
		// );
		// const tx = {
		// 	from: serverAddress,
		// 	to: process.env.WTTOKENCA,
		// 	nonce: nonce,
		// 	gasPrice: gasPrice, // maximum price of gas you are willing to pay for this transaction
		// 	gasLimit: 5000000,
		// 	data: data,
		// };
		// const signedTx = await caver.klay.accounts.signTransaction(
		// 	tx,
		// 	serverPrivateKey
		// );
	     
		// const hash = await caver.klay	.sendSignedTransaction(
		// 	signedTx.rawTransaction
		// );
		// if (hash) {
		// 	console.log(hash);
		// }

		const create = await caver.klay.accounts.wallet.add(serverPrivateKey);
		
		console.log(create);

		caver.klay.sendTransaction({
			type: 'SMART_CONTRACT_EXECUTION',
			from: serverAddress,
			to: process.env.WTTOKENCA,
			data: wtContract.methods.mintToken(user,caver.utils.toPeb('30','KLAY')).encodeABI(),
			gas: '300000',
		})
		.then(function(receipt){
			console.log(receipt);
		});
		
		
	},
	KIP_closeSerial: async (req, res) => {
		const { contentsName, serial } = req.body;
		console.log(contentsName, serial);
		// success Fe send normal data;
		// so we going to transaction to blockChain

		//First. we find data in mongoDB
		//Second. if we will be found data, we will change status
		const isCheck = await Batting.findOneAndUpdate(
			{ contentsName, serial },
			{ status: false }
		).exec();

		console.log(isCheck);
		try {
			if (isCheck !== null) {
				// const txHash = await caver.klay.sendTransaction({
				// 	type: 'SMART_CONTRACT_EXECUTION',
				// 	from: serverAddress,
				// 	to: process.env.WTTOKENCA,
				// 	data: wtContract.methods
				// 	.closeSerialContent(isCheck.contentsNum).encodeABI(),
				// 	gas: '300000',
				// })

			const tx = {
				from: serverAddress,
					to: process.env.WTTOKENCA,
					data: wtContract.methods
					.closeSerialContent(isCheck.contentsNum).encodeABI(),
					gas: '300000',
			}
		const signedTx = await caver.klay.accounts.signTransaction(tx, serverPrivateKey);
		const txHash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)
				
				console.log(
					'----- closeContentSerial' +
						isCheck.contentsNum +
						'function finish ----'
				);
				
				if (txHash) {
					res.status(201).json({
						success: true,
						detail: `${serial}번째 베팅이 종료 되었습니다.`,
					});
				}
			} else if (icCheck === null) {
				res.status(404).json({
					fail: false,
					detail: `${serial}번째 베팅이 닫히지 않았습니다.\n 확인바랍니다.`,
				});
			}
		} catch (e) {
			console.log('closeContentSerial function is not ~~' + e);
			res.status(404).json({
				fail: false,
				detail: `${serial}번째 베팅이 닫히지 않았습니다.\n 확인바랍니다.`,
			});
		}
	},
	KIP_closeContent: async (req, res) => {
		const contentNum = req.body.contentNum;
	
		
			const tx = {
				from: serverAddress,
				to: process.env.WTTOKENCA,
				data: wtContract.methods.closeContent(contentNum).encodeABI(),
				gas: '300000',
			}
		const signedTx = await caver.klay.accounts.signTransaction(tx, serverPrivateKey);
		const txHash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)
		
		console.log('----- closeContent' + contentNum + 'function finish ----');
		
		if (txHash) {
			Contents.findOneAndUpdate(
				{ contentNum },
				{ status: false },
				(err, data) => {
					console.log(data);
					if (!err) {
						res.status(201).json({ success: true });
					}
				}
			);
		}
	},
	KIP_payOut: async (req, res) => {
		const contentNum = req.body.contentNum;
		const answer = req.body.answer;
	
			const tx = {
				from: serverAddress,
				to: process.env.WTTOKENCA,
				data: await wtContract.methods
				.payOut(answer, contentNum)
				.encodeABI(),
				gas: '300000',
			}
		const signedTx = await caver.klay.accounts.signTransaction(tx, serverPrivateKey);
		const txHash = await caver.klay.sendSignedTransaction(signedTx.rawTransaction)
		
		
		console.log('----- payOut' + contentNum + 'function finish ----');
		
		if (txHash) {
			console.log(hash.logs[0].data);
			console.log(hash.logs[0].topics);
			res.status(201).json({ success: true });
		}
	},
};
