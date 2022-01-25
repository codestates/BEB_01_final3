// web3 모듈화
const Web3 = require('web3');
require('dotenv').config();
const { User } = require('../models/User');
const fs = require('fs');

// .env 파일, 디비 서버 publickey, privatekey, 네크워크

// const web3 = new Web3(
// 	new Web3.providers.HttpProvider(
// 		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
// 	)
// );
const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

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

const infuraWeb3Provider = (infuraURL) => {
	return new Web3(new Web3.providers.HttpProvider(infuraURL));
};

const newContract = (web3, abi, ca) => {
	return new web3.eth.Contract(abi, ca, {
		from: process.env.SERVERADDRESS,
		gas: 3000000,
	});
};

// server
// const

// 서버가 가지고 있는 wt, nwt 토큰 양이 적으면 서버 교체해주는 함수 (수정중)
const changeAuther = async () => {
	// 필터링 : role : 1 이면서 checkOwner 이 true 인 계정이 authoer 계정
	const server = await User.find({ role: 1 }).exec();
	const wtContract = newContract(web3, wtAbi, process.env.WTTOKENCA); // wt
	const nwtContract = newContract(web3, nwtAbi, process.env.NWTTOKENCA); // nwt
	const nftContract = newContract(web3, nftAbi, process.env.NFTTOKENCA); // nft
	let userList = [];

	for (value in server) {
		// console.log(server[value].publicKey);
		const serverCheckOwner = await wtContract.methods
			.checkAuth(server[value].publicKey)
			.call();
		console.log(serverCheckOwner);
		if (serverCheckOwner === true) {
			userList.push(server[value].publicKey);
		}
	}
	console.log(userList);
	// const serverCheckOwner = await wtContract.methods.checkOwner()
};

// changeAuther();

module.exports = { infuraWeb3Provider, newContract };
