const mongoose = require('mongoose');
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
	bids: {
		ownerAddress: {
			type: String,
		},
		bidAdress: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		bid: {
			type: Number,
		},
		biddest: {
			type: Boolean,
		},
		bidding: {
			type: Boolean,
		},
		tx: {
			type: String,
		},
	},
});

const Nft = mongoose.model('Nft', nftSchema);

module.exports = { Nft };

//
