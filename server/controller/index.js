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

// exchange wt <-> nwt : approve user > swapCA / approve server > swapCA

// approve
const approve = (
	web3,
	token,
	spender_address,
	wallet_address,
	user_private_key
) => {
	const spender = spender_address;
	const nonce = web3.eth.getTransactionCount(wallet_address);
};

// function approveToken(address owner,address spender)public {
// 	uint256 amount = balanceOf(owner);
//    _approve(owner,spender,amount);
// }

// def approve(token, spender_address, wallet_address, private_key):

//   spender = spender_address
//   max_amount = web3.toWei(2**64-1,'ether')
//   nonce = web3.eth.getTransactionCount(wallet_address)

//   tx = token.functions.approve(spender, max_amount).buildTransaction({
//       'from': wallet_address,
//       'nonce': nonce
//       })

//   signed_tx = web3.eth.account.signTransaction(tx, private_key)
//   tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)

//   return web3.toHex(tx_hash)

// mint WT Token
const mintWTToken = () => {
	// infura ropsten 에서로 바꾸기
};

module.exports = { infuraWeb3Provider, newContract };
