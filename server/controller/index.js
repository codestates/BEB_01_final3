// web3 모듈화
const Web3 = require('web3');
require('dotenv').config();
const { User } = require('../models/User');
const fs = require('fs');

// .env 파일, 디비 서버 publickey, privatekey, 네크워크

const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);
// const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

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

// 경우 1 : 로그인한 계정이 서버한테 권한을 받고 nft 민팅을 진행하려고 함. => serverAddress 가 로그인 중인 서버 계정이어야함
// 원래 기존의 CA배포한 서버계정(serverAddress), 로그인되어 있는 서버 주소({ _id: req.user._id }, {role:1})
// serverAddress 를 현재 로그인 중인 서버계정으로 바꾸는 함수
const changeAuther = async (highPrivilege, loginServer) => {
	// param1, param2 같은지 체크
	// Auth 권한 받은지 체크, role : 1 체크
	// 로그인 되어 있는 서버 계정의 이더양 체크
	let difCheck = false;
	let web3Check = false;
	let roleCheck = false;
	let etherCheck = false;

	if (highPrivilege !== loginServer) {
		difCheck = true;
	} else {
		difCheck = false;
	}

	const wtContract = newContract(web3, wtAbi, process.env.WTTOKENCA); // wt
	const nwtContract = newContract(web3, nwtAbi, process.env.NWTTOKENCA); // nwt
	const nftContract = newContract(web3, nftAbi, process.env.NFTTOKENCA); // nft

	const serverDB_addr = await User.find({ role: 1 }).exec();

	for (value in serverDB_addr) {
		if (serverDB_addr[value].publicKey === loginServer) {
			roleCheck = true;
		}
	}

	const checkWT = await wtContract.methods.checkAuth(loginServer).call();
	const checkNWT = await nwtContract.methods.checkAuth(loginServer).call();
	const checkNFT = await nftContract.methods.checkAuth(loginServer).call();
	if (checkWT && checkNWT && checkNFT) {
		web3Check = true;
	} else {
		web3Check = false;
	}

	const loginEther = await web3.eth.getBalance(loginServer);
	if (parseFloat(loginEther) >= 0.01) {
		etherCheck = true;
	}

	if (difCheck && roleCheck && web3Check && etherCheck) {
		return loginServer;
	} else {
		return highPrivilege;
	}
};

// changeAuther(
// 	'0x31e39BBAFB77c4B0411CBfe43875D15AA7697A5c',
// 	'0xFb63340661D504fbC389bA9015D05aEF00a94cd0'
// );

// 경우 2 : 유저들이 wt, nwt 토큰을 발행,
// 경우 3 :

// 로그인한 서버가 자신의 이더를 사용 => 컨트랙트 실행
// 로그인한 서버가 아직은 최고 관리자의 이더를 사용 => 컨트랙트 실행
// 1순위 : 최고관리자, 2순위 : 현재 로그인한 서버계정, 3순위 : 서버계정중 가장 많은 양의 이더를 가진 계정
// 파라미터 값은 최고 관리자 서버계정
// 현재 로그인 되어 있는 { _id: req.user._id }
const targetServerAddress = async (address) => {
	try {
		const ownerList = await User.findOne({
			role: 1,
			// _id: req.user._id,
		}).exec();
		console.log(ownerList);
	} catch (err) {
		console.log(err);
		console.log('로그인한 유저가 서버계정이 아님');
	}
	return 'aaaa';
};

// nft 민팅 : 권한을 받은 서버계정이 먼저 1순위

// targetServerAddress(process.env.SERVERADDRESS);

// 서버가 가지고 있는 wt, nwt 토큰 양이 적으면 서버 교체해주는 함수 (수정중)
const changeAuther1 = async () => {
	// 필터링 : role : 1 이면서 checkOwner 이 true 인 계정이 authoer 계정
	const server = await User.find({ role: 1 }).exec();
	const wtContract = newContract(web3, wtAbi, process.env.WTTOKENCA); // wt
	const nwtContract = newContract(web3, nwtAbi, process.env.NWTTOKENCA); // nwt
	const nftContract = newContract(web3, nftAbi, process.env.NFTTOKENCA); // nft
	let userList = [];

	const serverEther = await web3.eth.getBalance(serverAddress);
	console.log(web3.utils.fromWei(serverEther, 'ether'));

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

module.exports = { infuraWeb3Provider, newContract, changeAuther };
