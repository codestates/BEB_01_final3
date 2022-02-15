const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Nft } = require('../models/Nft');
const { User } = require('../models/User');

///////////////web3//////////////////
// const {
// 	exchange_WTToken,
// 	SearchNft,
// 	exchange_NWTToken,
// 	serverWT_faucet,
// 	serverNWT_faucet,
// 	myPage,
// 	TotalTokens,
// } = require('../controller/api');


// const {
// 	NFTlist,
// 	createNFT,
// 	buyNFT,
// 	setForSell,
// 	cancel,
// 	nftauction,
// 	setToken,
// 	bids,
// 	withdraw,
// 	endauction
// } = require('../controller/nft');
///////////////////////////////////////caver////////////////////////
const {
	exchange_WTToken,
	SearchNft,
	exchange_NWTToken,
	serverWT_faucet,
	serverNWT_faucet,
	myPage,
	TotalTokens,
} = require('../controller/caver_api');


const {
	NFTlist,
	createNFT,
	buyNFT,
	setForSell,
	cancel,
	nftauction,
	setToken,
	bids,
	withdraw,
	endauction
} = require('../controller/caver_nft');


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

router.post('/bid', auth, bids);
router.post('/withdraw', auth, withdraw)
router.post('/endauction', auth, endauction)
// user gonna set price for nft
router.post('/nft/sell', auth, setForSell);

router.post('/nft/auction', auth, nftauction);

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
