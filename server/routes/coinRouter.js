const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Nft } = require('../models/Nft');
const { User } = require('../models/User');

const {
	exchange_WTToken,
	SearchNft,
	exchange_NWTToken,
	serverWT_faucet,
	serverNWT_faucet,
	myPage,
	TotalTokens,
} = require('../controller/api');


const {
	NFTlist,
	createNFT,
	buyNFT,
	setForSell,
	cancel,
	setToken
} = require('../controller/nft');
const Web3 = require('web3');
const { LogTimings } = require('concurrently');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);

// server 계정 토큰 민팅 wt, nwt
// 버튼 완성되면 관리자 계정 로그인된 상태에서 가능할 수 있도록 수정
router.get('/token/faucetWT', serverWT_faucet);
router.get('/token/faucetNWT', serverNWT_faucet);

// user won exchange wt
router.post('/token/exchangeWT', auth, exchange_WTToken);
// user wt exchange nwt
router.post('/token/exchangeNWT', auth, exchange_NWTToken);

//import nftList
router.post('/nft/list', auth, NFTlist);

// server address create NFT MINT
router.post('/nft/create', auth, createNFT);

// user or server gonna buy a NFT
router.post('/buyNFT', auth, buyNFT);

// user gonna set price for nft
router.post('/nft/sell', auth, setForSell);

//user gonna cancel for selling the nft
router.post('/nft/cancel', auth, cancel);

router.get('/myPage', auth, myPage);

router.post('/users/SearchNft', SearchNft);


// wt token totalAmount
// server wt token amount
// nwt token totalAmount
// server nwt token amount
router.get('/totalTokens', auth, TotalTokens);














router.get('/setToken', auth, setToken);
module.exports = router;
