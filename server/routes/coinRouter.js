const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');


const { User } = require('../models/User');

const {
	exchange_WTToken,
	NFTlist,
	createNFT, 
	buyNFT,
	setForSell,
	ownerOf,
	cancel,
	Search
  
    } = require('../controller/api');

// server address
const serverAddress = '';
const serverPrivateKey = '';
const Web3 = require('web3');
const { LogTimings } = require('concurrently');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6"));


// server 계정 토큰 민팅 - WT (stable coin)
router.get('/faucet', (req, res) => {
	console.log('aa');
	console.log();
});

// user won exchange wt
router.post('/token/exchangeWT', exchange_WTToken);
// /token/exchangeWT


//import nftList
router.get('/nft/list', NFTlist);

// server address create NFT MINT
router.post('/nft/create',createNFT);

// user or server gonna buy a NFT 
router.post('/buyNFT', buyNFT);

// user gonna set price for nft
router.post('/nft/sell',setForSell);

//user gonna cancel for selling the nft
router.post('/nft/cancel',cancel);

router.post('/myPage',(req,res)=>{
	const email = req.body.email
	 console.log(email);
	console.log(email);
	User.find({email:email},(err,userResult)=>{
		//정보에 해당되는 Nft정보를 다시 긁어와서 보내준다.
		Nft.find({address : userResult[0].publicKey},(req,nftResult)=>{
			console.log(nftResult);
			res.json({userInfo : userResult,
					  nftInfo : nftResult
			})
		})
	})
	})

router.post('/users/Search', Search);

module.exports = router;
 