const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
	userJoin,
	userLogin,
	Auth,
	userLogout,
	test,
} = require('../controller/api');
const fs = require('fs');
// server address
const serverAddress = '';
const serverPrivateKey = '';
// abi json
// let tokenAbi = fs.readFileSync('./d');
// web3
const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider())

// server 계정 토큰 민팅 - WT (stable coin)
router.get('/faucet', (req, res) => {
	console.log('aa');
	console.log();
});

// server 계정 토큰 민팅 - (유동성 코인)

//

module.exports = router;
