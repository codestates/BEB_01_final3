const { User } = require('../models/User');
const { Nft } = require('../models/Nft');
const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);
const fs = require('fs');
const NFTABI = fs.readFileSync('server/abi/NFTWT.json', 'utf8');
const nftAbi = JSON.parse(NFTABI);
const nftContract = new web3.eth.Contract(nftAbi, process.env.NFTCA);

module.exports = {
	userJoin: async (req, res) => {
		//지갑을 생성하고 지갑을 추가해주는 메서드
		const account = await web3.eth.accounts.create(
			web3.utils.randomHex(32)
		);
		await web3.eth.accounts.wallet.add({
			address: account.address,
			privateKey: account.privateKey,
		});

		 try{
		const sendAccount = process.env.serverAddress;
		const privateKey = process.env.serverAddress_PK;
		  const data =  await nftContract.methods.approveSale(account.address).encodeABI();
		  const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');
	
		const tx = {
			from: sendAccount,
			to: process.env.NFTCA,
			nonce: nonce,
			gas: 5000000,
			data: data,
		  };
	  
		  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
		  const hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt',(txHash)=>{
	
			const userInfo = {
				...req.body,
				publicKey: account.address,
				privateKey: account.privateKey,
				wtToken: 5,
				nwtToken: 5,
				nftToken: '',
			};
			const user = new User(userInfo);
	
			user.save((err, userInfo) => {
				if (err) {
					res.json({ success: false, err });
					return;
				}
				console.log('ui', userInfo);
				res.status(200).json({
					success: true,
				});
			});
		  })
		}catch(e){
			console.log(e);
			res.json({failed:false})
		}
		
	},
	userLogin: (req, res) => {
		// console.log('ping')
		//요청된 이메일을 데이터베이스에서 있는지 찾는다.
		User.findOne({ email: req.body.email }, (err, user) => {
			// console.log('user', user)
			if (!user) {
				return res.json({
					loginSuccess: false,
					message: '제공된 이메일에 해당하는 유저가 없습니다.',
				});
			}

			//요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
			user.comparePassword(req.body.password, (err, isMatch) => {
				// console.log('err',err)

				// console.log('isMatch',isMatch)

				if (!isMatch)
					return res.json({
						loginSuccess: false,
						message: '비밀번호가 틀렸습니다.',
					});

				//비밀번호 까지 맞다면 토큰을 생성하기.
				user.generateToken((err, user) => {
					if (err) return res.status(400).send(err);

					// 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지
					res.cookie('x_auth', user.token)
						.status(200)
						.json({ loginSuccess: true, userId: user._id });
				});
			});
		});
	},

	Auth: (req, res) => {
		//여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
		res.status(200).json({
			_id: req.user._id,
			isAdmin: req.user.role === 0 ? false : true,
			isAuth: true,
			email: req.user.email,
			name: req.user.name,
			lastname: req.user.lastname,
			role: req.user.role,
			image: req.user.image,
		});
	},
	userLogout: (req, res) => {
		// console.log('req.user', req.user)
		User.findOneAndUpdate(
			{ _id: req.user._id },
			{ token: '' },
			(err, user) => {
				if (err) return res.json({ success: false, err });
				return res.status(200).send({
					success: true,
				});
			}
		);
	},
	userTokens: (req, res) => {
		try {
			User.findOne({ _id: req.user._id }, (err, user) => {
				const userTokens = {
					wtToken: user.wtToken,
					nwtToken: user.nwtToken,
				};
				res.json(userTokens);
			});
		} catch (err) {
			res.json({ success: false, err });
		}
	},

	exchange_WTToken: (req, res) => {
		console.log('Aa');
		console.log(req.body);
		res.json({ success: true });
	},
	NFTlist : (req,res)=>{
		Nft.find({sale:true}, (err, result) => {
			res.json({ data: result });
		});
	},
	createNFT : async (req,res)=>{

	const {
		userId,
		contentTitle,
		nftName,
		nftDescription,
		imgURI,
		tokenURI,
		price,
	} = req.body.result;

		const sendAccount = process.env.serverAddress;
	const privateKey = process.env.serverAddress_PK;
		const data =  await nftContract.methods.mintNFT(tokenURI,web3.utils.toWei(price,'ether')).encodeABI();
		const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');
	const tx = {
		from: sendAccount,
		to: process.env.NFTCA,
		nonce: nonce,
		gas: 5000000,
		data: data,
		};


		try{
		

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
}catch(e){
   console.log("err"+e);
   res.json({failed:false})
}
	},
	buyNFT : async (req,res)=>{
    
	const tokenId = req.body.tokenId;
	const email = req.body.buyer;

	const userInfo = await User.findOne({ email:email}).exec();
	const buyer = userInfo.publicKey;

	console.log(tokenId);
	const owner = await nftContract.methods.ownerOf(tokenId).call();

  
	if(owner === buyer){
	  res.json({failed: false, reason : "owner is not buy "})
	  return
	}
  
	const sendAccount = process.env.serverAddress;
	const privateKey = process.env.serverAddress_PK;
	  const data =  await nftContract.methods.purchaseToken(tokenId,buyer).encodeABI();
	  const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');

	const tx = {
		from: sendAccount,
		to: process.env.NFTCA,
		nonce: nonce,
		gas: 5000000,
		data: data,
	  };
	  try{
	  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
	  await web3.eth.sendSignedTransaction(signedTx.rawTransaction,(err,hash)=>{
		  
		  Nft.findOneAndUpdate({tokenId:tokenId},{address:buyer,sale:false},(err,result)=>{
		   console.log('DB success');
		 
		   res.json({success:true , detail : 'db store success and block update success'});
	   })

	})
  }catch(e){
	  console.log(e);
	  res.json({failed:false , reason:'i do not know'})
  }
  
	},
	myPage : (req,res)=>{

		try{
			
		const email = req.body.email
		console.log(email);
       User.find({email:email},(err,userResult)=>{
		   console.log(userResult[0].publicKey);
	   Nft.find({address : userResult[0].publicKey},(req,nftResult)=>{
		res.json({userInfo : userResult,
		          nftInfo : nftResult
		})
	})
})
		}
		catch(e){
			console.log(e);
			res.json({faile:false, reason:'i do not know'})
		}
	},

	setForSell : async (req,res)=>{
		 
			const tokenId = req.body.tokenId;
			console.log(tokenId);
			const sellPrice = req.body.sellPrice;
			const sendAccount = process.env.serverAddress;
	const privateKey = process.env.serverAddress_PK;
	  const data =  await nftContract.methods.setForSale(tokenId,web3.utils.toWei(sellPrice,'ether')).encodeABI();
	  const nonce = await web3.eth.getTransactionCount(sendAccount, 'latest');
	const tx = {
		from: sendAccount,
		to: process.env.NFTCA,
		nonce: nonce,
		gas: 5000000,
		data: data,
	  };

	  console.log(tx);
  
	    try{
	  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
	  await web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt',(txHash)=>{

		console.log(txHash);
	
		Nft.findOneAndUpdate({tokenId:tokenId},{sale:true},(err,result)=>{
			console.log('DB success');
			res.json({success:true , detail : 'db store success and block update success'});
			if(err) console.log(err);
		})
		
	  })
	}catch(e){
		console.log(e);
		res.json({failed:false})
	}
	  
	  

	},
	ownerOf : async (req,res)=>{
		const owner = await nftContract.methods.ownerOf('85').call();

		console.log(owner);
	},
	cancel : (req,res)=>{
		const tokenId = req.body.tokenId;
		Nft.findOneAndUpdate({tokenId:tokenId},{sale:false},(err,result)=>{
			console.log('user gonna cancel sell for nft');
			res.json({success:true , detail : 'user gonna cancel sell for nft'});
			if(err) console.log(err);
		})
	},

	Search : (req, res) => {
		// console.log('req.user', req.user)
  
		let name = req.query.name;
		console.log(name);
		// let productId = req.query._id;
		
		// aggregate 내부의 파라미터는 배열러 받을 수 있으며 json형식으로 구성되어 있다
		User.aggregate([{$search: {index:"nftName", text: {query: name, path: "nftName"}}}], (err, user) => {
		  console.log(user);
			
	  })
		// { token: ""}
	
	}
	
};
