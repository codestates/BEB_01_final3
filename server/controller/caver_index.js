// web3 모듈화
const Caver = require('caver-js');
require('dotenv').config();
const { User } = require('../models/User');
const fs = require('fs');
const cron = require('node-cron');

// .env 파일, 디비 서버 publickey, privatekey, 네크워크

const caver = new Caver(
	new Caver.providers.HttpProvider('https://api.baobab.klaytn.net:8651/')
);

//계정부분
let serverAddress = process.env.SERVERADDRESS;
let serverPrivateKey = process.env.SERVERPRIVATEKEY;
// auth 권한 부여받은 계정(contract 이용가능 => msg.sender : owner)
const subManagerAddress = '';

// abi json
// const WTABI = fs.readFileSync('server/abi/KIP_WTToken.json', 'utf-8');
const WTABI = fs.readFileSync('../abi/KIP_WTToken.json');
const NWTABI = fs.readFileSync('../abi/KIP_NWTToken.json', 'utf-8');
const NFTABI = fs.readFileSync('../abi/KIP_NFTWT.json', 'utf8');
const SWAPABI = fs.readFileSync('../abi/KIP_TokenSwap.json', 'utf-8');

// abi parse
const nftAbi = JSON.parse(NFTABI);
const wtAbi = JSON.parse(WTABI); // wt token, exchange, vote
const nwtAbi = JSON.parse(NWTABI);
const swapAbi = JSON.parse(SWAPABI);

// const infuraWeb3Provider = (infuraURL) => {
// 	return new Web3(new Web3.providers.HttpProvider(infuraURL));
// };

const CavernewContract = (caver, abi, ca) => {
	return new caver.klay.Contract(abi, ca, {
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

// 경우 2 : 유저들이 wt, nwt 토큰을 발행,
// 1순위 : 서버 root 계정, 2순위 : 관리자 권한을 받은 서버 계정, 3순위 : 전체 관리자 계정에서 토큰 갯수와 이더양이 가장 많은 계정
// 크론을 1분마다 돌려서 서버계정을 확인해서 바꿔주는 함수
const targetServerAddress = async (serverAddress) => {
	// console.log('크론으로 돌리는 중');
	const wtContract = newContract(web3, wtAbi, process.env.WTTOKENCA); // wt
	const nwtContract = newContract(web3, nwtAbi, process.env.NWTTOKENCA); // nwt
	const nftContract = newContract(web3, nftAbi, process.env.NFTTOKENCA); // nft

	// 1순위 체크 : 서버 root 계정이 넉넉한 양의 토큰을 가지고 있는지, 이더를 보유하고 있는지 체크
	const wtAmount = web3.utils.fromWei(
		await wtContract.methods.balanceOf(serverAddress).call(),
		'ether'
	);
	const nwtAmount = web3.utils.fromWei(
		await nwtContract.methods.balanceOf(serverAddress).call(),
		'ether'
	);

	const etherAmount = web3.utils.fromWei(
		await web3.eth.getBalance(serverAddress),
		'ether'
	);

	let serverList = [];

	// 2순위 체크 : 관리자 권한을 받은 서버가 넉넉한 양의 토큰을 가지고 있는지, 이더를 보유하고 있는지 체크
	// 3순위 체크 : 전체 관리자 계정에서 토큰 갯수와 이더양이 가장 많은 계정

	const server = await User.find({ role: 1 }).exec();
	for (value in server) {
		// console.log(server[value].publicKey);
		const serverCheckOwnerWT = await wtContract.methods
			.checkAuth(server[value].publicKey)
			.call();
		const serverCheckOwnerNWT = await nwtContract.methods
			.checkAuth(server[value].publicKey)
			.call();
		const serverCheckOwnerNFT = await nftContract.methods
			.checkAuth(server[value].publicKey)
			.call();
		if (serverCheckOwnerWT && serverCheckOwnerNWT && serverCheckOwnerNFT) {
			serverList.push(server[value].publicKey);
		}
	}

	if (
		parseInt(wtAmount) >= 10000 &&
		parseInt(nwtAmount) >= 1000 &&
		parseFloat(etherAmount) >= 0.01
	) {
		return serverAddress;
	} else {
		// wt, nwt, ether 비교
		let wtAmount = 0,
			nwtAmount = 0,
			etherAmount = 0,
			maxIndex = '';
		for (addr in serverList) {
			let wt = web3.utils.fromWei(
				await wtContract.methods.balanceOf(serverList[addr]).call(),
				'ether'
			);
			let nwt = web3.utils.fromWei(
				await nwtContract.methods.balanceOf(serverList[addr]).call(),
				'ether'
			);
			let eth = web3.utils.fromWei(
				await web3.eth.getBalance(serverList[addr]),
				'ether'
			);
			if (
				wtAmount <= parseInt(wt) &&
				nwtAmount <= parseInt(nwt) &&
				etherAmount <= parseFloat(eth)
			) {
				wtAmount = wt;
				nwtAmount = nwt;
				etherAmount = eth;
				maxIndex = serverList[addr];
			}
		}
		return maxIndex;
	}
};

// server 키를 알아서 비밀키에 넣어줌
const targetAddrPK = async (addr) => {
	const auth = await User.findOne({ publicKey: addr }).exec();
	return auth.privateKey;
};

// 로그인한 서버가 자신의 이더를 사용 => 컨트랙트 실행
// 로그인한 서버가 아직은 최고 관리자의 이더를 사용 => 컨트랙트 실행
// 1순위 : 최고관리자, 2순위 : 현재 로그인한 서버계정, 3순위 : 서버계정중 가장 많은 양의 이더를 가진 계정
// 파라미터 값은 최고 관리자 서버계정
// 현재 로그인 되어 있는 { _id: req.user._id }

module.exports = {
	// infuraWeb3Provider,
	// CavernewContract,
	// changeAuther,
	// targetServerAddress,
	// targetAddrPK,
};
