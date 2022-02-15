require('dotenv').config();

const Caver = require('caver-js');
const caver = new Caver(
	new Caver.providers.HttpProvider('https://api.baobab.klaytn.net:8651')
);
const fs = require('fs');

const CavernewContract = (caver, abi, ca) => {
	return new caver.klay.Contract(abi, ca, {
		from: process.env.SERVERADDRESS,
		gas: 3000000,
	});
};

const KIPWTABI = fs.readFileSync('../abi/KIP_WTToken.json', 'utf-8');
const KIPNWTABI = fs.readFileSync('../abi/KIP_NWTToken.json', 'utf-8');
const KIPNFTABI = fs.readFileSync('../abi/KIP_NFTWT.json', 'utf8');
const KIPSWAPABI = fs.readFileSync('../abi/KIP_TokenSwap.json', 'utf-8');

const nftAbi = JSON.parse(KIPNFTABI);
const wtAbi = JSON.parse(KIPWTABI); // wt token, exchange, vote
const nwtAbi = JSON.parse(KIPNWTABI);
const swapAbi = JSON.parse(KIPSWAPABI);

const nftContract = CavernewContract(caver, nftAbi, process.env.NFTTOKENCA); // nft
const wtContract = CavernewContract(caver, wtAbi, process.env.WTTOKENCA); // wt
const nwtContract = CavernewContract(caver, nwtAbi, process.env.NWTTOKENCA); // nwt
const swapContract = CavernewContract(caver, swapAbi, process.env.SWAPCA); // swap

module.exports = {
    nftContract,
    wtContract,
    nwtContract,
    swapContract,
    caver,
}