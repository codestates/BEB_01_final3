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
    
}