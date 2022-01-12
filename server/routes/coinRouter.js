const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {} = require('../controller/api');
const fs = require('fs');
const { Nft } = require("../models/Nft");
// server address
const serverAddress = '';
const serverPrivateKey = '';
// abi json

// web3
const Web3 = require('web3');
const { LogTimings } = require('concurrently');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6"));

// server 계정 토큰 민팅 - WT (stable coin)
router.get('/faucet', (req, res) => {
	console.log('aa');
	console.log();
});

// server 계정 토큰 민팅 - (유동성 코인)

//





  let NFTABI = fs.readFileSync('server/abi/NFTWT.json','utf8');
  const nftAbi =JSON.parse(NFTABI);
  const nftContract = new web3.eth.Contract(nftAbi,process.env.NFTCA,{from : process.env.serverAddress})
  console.log(Nft);
  



router.get('/nftList',(req,res)=>{

	Nft.find({},(err,result)=>{
		res.json({data:result})
	})

})

router.post('/', async (req,res)=>{
    
	// 이제 데이터를 프론트에서 받아 옴으로써 블록체인에 올리고 성공하면 DB에 저장까지!

	const {userId,contentTitle,nftName,nftDescription,imgURI,tokenURI,price} = req.body.result;

	const sendAccount = process.env.serverAddress;
  const privateKey = process.env.serverAddress_PK;
	const data =  await nftContract.methods.mintNFT(tokenURI,price).encodeABI();
	const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');
  const tx = {
      from: sendAccount,
      to: process.env.NFTCA,
      nonce: nonce,
      gas: 5000000,
      data: data,
    };
    

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  await web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt',(txHash)=>{
   
      console.log(txHash);
      let logs = txHash.logs;
      const tokenId = web3.utils.hexToNumber(logs[0].topics[3]);
       console.log("🎉 The hash of your transaction is: ");
        const nft = new Nft();
        nft.address = sendAccount     
			  nft.tokenId = tokenId,
			  nft.contentTitle = contentTitle
			  nft.nftName = nftName
			  nft.description = nftDescription
			  nft.imgUri = imgURI
			  nft.tokenUrl = tokenURI
        nft.price = price

        nft.save((err, userInfo) => {
				
          if(!err){
           res.json({success:true})
          }else{
            res.json({failed:false})
          }
			  })
    
  })
})

// router.get('/',async (req,res)=>{
//   let hash = '0x1d8576440ffd46668911b1ae33a5018860ec3d342271b55c97f01dfe41d882fb';

//   let tokenId;
 

 

//   console.log(tokenId);
//   await web3.eth.getTransactionReceipt(hash,(err,data)=>{
                
//     let logs = data.logs;
//     const aa = web3.utils.hexToNumber(logs[0].topics[3]);
//     tokenId = aa;
//   })
//   console.log(tokenId);


// })
 








router.post('/buyNFT', async (req,res)=>{     
  
	const tokenId = req.body.tokenId;
  const owner = await nftContract.methods.ownerOf(tokenId).call();
	const buyer = '0xdB41F06dde2AFAD8670ad926499ec2D05da433ce';

  if(owner === buyer){
    res.json({data : "faile owner not buy itSelf"})
    return
  }

  const sendAccount = process.env.serverAddress;
  const privateKey = process.env.serverAddress_PK;
	const data =  await nftContract.methods.purchaseToken(tokenId,buyer).encodeABI();
	const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');
  try{
  const tx = {
      from: sendAccount,
      to: process.env.NFTCA,
      nonce: nonce,
      gas: 5000000,
      data: data,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction,(err,hash)=>{

        web3.eth.getTransaction(hash,(err,data)=>{
          
        if(data.blockHash === null){
          res.json({failed:false})
        }
        })
        
        Nft.findOneAndUpdate({tokenId:tokenId},{address:buyer},(err,result)=>{
         console.log('DB success');
         res.json({success:true});
     })
  })
}catch(e){
    console.log(e);
}


	
})
module.exports = router;
 