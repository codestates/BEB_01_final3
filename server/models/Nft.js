const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tokenId, nftName, imgUrl, description, 발행자:(주식회사Watto), tokenUrl
// 좋아요, 즐겨찾기 칼럼 추가하기
const nftSchema = mongoose.Schema({
	address: {
		type: String,
	},
	tokenId: {
		type: Number,
	},
	contentTitle: {
		type: String,
		maxlength: 50,
	},
	nftName: {
		type: String,
		maxlength: 50,
	},
	description: {
		type: String,
	},
	imgUri: {
		type: String,
	},
	tokenUrl: {
		type: String,
	},
	price: {
		type: Number,
	},
	sale: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
		default: '',
	},
	spender: {
		type: String,
		default:'',
	},
	bids: {
		type : Array,
		default:[],
	},
});

const Nft = mongoose.model('Nft', nftSchema);

module.exports = { Nft };

//
