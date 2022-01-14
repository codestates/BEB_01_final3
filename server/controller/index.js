// web3 모듈화
const Web3 = require('web3');
require('dotenv').config();

const infuraWeb3Provider = (infuraURL) => {
	return new Web3(new Web3.providers.HttpProvider(infuraURL));
};

const newContract = (web3, abi, ca) => {
	return new web3.eth.Contract(abi, ca, {
		from: process.env.SERVERADDRESS,
		gas: 3000000,
	});
};

// mint WT Token
const mintWTToken = () => {
	// infura ropsten 에서로 바꾸기
};

module.exports = { infuraWeb3Provider, newContract };
