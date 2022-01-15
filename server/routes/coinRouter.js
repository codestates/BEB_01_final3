const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Nft } = require('../models/Nft');
const { User } = require('../models/User');

const {
	exchange_WTToken,
	NFTlist,
	createNFT,
	buyNFT,
	setForSell,
	ownerOf,
	cancel,
	SearchNft,
	exchange_NWTToken,
	serverWT_faucet,
} = require('../controller/api');

// server address
const serverAddress = '';
const serverPrivateKey = '';
const Web3 = require('web3');
const { LogTimings } = require('concurrently');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);

// server 계정 토큰 민팅 - (유동성 코인)
// server 계정 토큰 민팅 - WT (stable coin)
// server 계정 mypage 에서 faucet 실행하도록
router.get('/token/faucet', serverWT_faucet); // 잠시 auth 뺌

// user won exchange wt
router.post('/token/exchangeWT', auth, exchange_WTToken);
// user wt exchange nwt
router.post('/token/exchangeNWT', auth, exchange_NWTToken);

// user won exchange wt
router.post('/token/exchangeWT', exchange_WTToken);
// /token/exchangeWT

//import nftList
router.get('/nft/list', auth, NFTlist);

// server address create NFT MINT
router.post('/nft/create', auth, createNFT);

// user or server gonna buy a NFT
router.post('/buyNFT', auth, buyNFT);

// user gonna set price for nft
router.post('/nft/sell', auth,setForSell);

//user gonna cancel for selling the nft
router.post('/nft/cancel', auth,cancel);

router.post('/myPage', auth, (req, res) => {
	const email = req.body.email;
	// console.log(email);
	// console.log('email', email);
	User.find({ email: email }, (err, userResult) => {
		//정보에 해당되는 Nft정보를 다시 긁어와서 보내준다.
		Nft.find({ address: userResult[0].publicKey }, (req, nftResult) => {
			// console.log(nftResult);
			res.json({ userInfo: userResult, nftInfo: nftResult });
		});
	});
});

router.post('/users/SearchNft', SearchNft);

module.exports = router;
