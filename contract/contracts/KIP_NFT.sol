// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "../klaytn-contracts-master/contracts/token/KIP7/KIP7.sol";
import "../klaytn-contracts-master/contracts/token/KIP17/KIP17.sol";
import "../klaytn-contracts-master/contracts/drafts/Counters.sol";
import "../klaytn-contracts-master/contracts/token/KIP17/KIP17Full.sol";
import "../klaytn-contracts-master/contracts/ownership/Ownable.sol";

    contract WATTONFT is KIP17Full, Ownable {  
        using Counters for Counters.Counter;
        Counters.Counter private _tokenIds;

        IKIP7 public token;  //IERC20 함수를 사용한다. 위함이다 setToken을 먼저 해줄 수 있도록 
        uint256 public nftPrice; // nft 가격을 정하기위해서 만들어논 상태변수 

        event NewNft(address owner, uint256 tokenId, string tokenUri);

        mapping (string => uint256) public getTokenId;   // tokenUri를 key값으로하는 tokenId를 얻기위한 맵핑 tokenId가 재대로반환이 되지않아서 만들어 놓았다.
        mapping (uint256 => uint256) public tokenPrice;   // 토큰아이디를 통해서 해당 nft의 가격을 알 수 있게 만들어 놓은 맵핑 

        constructor() public KIP17Full ("WATTONFTs", "WTNFT") {}   

    //-------------------함수시작 ------------- 
    //*참고사항* 서버중앙화 방식을 사용하기 때문에 onlyOwner가 들어가있고 
    //이때의  onwer 및 msg.sender가 어떻게 되는지 생각하면서 함수를 짜야한다.


    //1. setToken erc20컨트랙주소를 가져와서 IERC20에 접근하여 IERC20의 함수를 사용가능 
    //    IERC20함수의 member가 무엇이 있는지 정확하게 파악하고 사용할 것. 
    function setToken (address tokenAddress) public returns (bool) {
            require(tokenAddress != address(0x0));
            token = IKIP7(tokenAddress);
            return true;
        }

    
    //2. mintNFT erc721에 있는 _mint함수를 이용해서 유일한 토큰을 생성하는 함수 
    // 밑에 nft발행방식은 누군가에게 발헹해주는 방식이 아닌 서버계정 자체에 nft를 발행해주는 함수.
        function mintNFT(string memory tokenURI) public returns (uint256) {
            
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            _setTokenURI(newItemId, tokenURI); 
            emit NewNft(msg.sender,newItemId,tokenURI);
           
            return newItemId;
        }

    // 3. approveSale함수를 사용해서 소유자가 msg.seder에게 대납소유권을 허락해주는 방식. 그래야지 safeTransferFrom을 사용할 수 가 있다.
        function approveSale(address receipent) public {
            setApprovalForAll(receipent, true);
        }

        

        // 4.setForSale함수를 이용해서 소유자가 tokenId에 가격을 지정할 수 있다. 
        function setForSale(uint256 _tokenId, uint256 _price) public {
            //토큰의 소유자 계정만 판매하도록 만드는 함수
            address tokenOwner = ownerOf(_tokenId);
            require(tokenOwner != address(0x0));
            if(tokenOwner == msg.sender){
            require(_price > 0,'price is zero or lower'); 
            tokenPrice[_tokenId] = _price;
            }else{
            require(_price > 0,'price is zero or lower');
            require(isApprovedForAll(tokenOwner, msg.sender),'token owner did not approve');  
            tokenPrice[_tokenId] = _price;
            }
        
        }

    // 5. purchaseToken함수를 사용해서 seller 와 buyer간에 교환이 이루어 질 수 있다.

        function purchaseToken(uint256 _tokenId,address buyer) public {
            uint bal = token.balanceOf(buyer);
            uint256 price = tokenPrice[_tokenId];
            address tokenSeller = ownerOf(_tokenId);

            require(buyer != address(0x0));
            require(tokenSeller != address(0x0));
            require(bal >= price,"buyer is not enough money");
            require(tokenSeller != buyer,"owner not buy itself");  //본인은 구매를 못함 
        

            token.transferFrom(buyer,tokenSeller,price);  // 구매자가 판매자게에 erc20토큰을 보내는 함수.
            safeTransferFrom(tokenSeller, buyer, _tokenId);  // 판매자가 구매자에게 tokenId를 넘기는 함수.
            
        }


    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);
    event Endedat(uint a);
    

    struct Auction {
            bool started;
            address owner;
            uint nftId;
            bool status;
            uint endAt;
            address highestBidder;
            uint highestBid;
            bool ended;
            
        }
    mapping(uint => Auction) auction;
    mapping(uint => mapping(address => uint)) public bids;
    
    function startAuction(uint nftId, address owner, uint _startingBid) public {
         auction[nftId].nftId = nftId;
         auction[nftId].owner = owner;
         auction[nftId].started = true;
         auction[nftId].highestBid = _startingBid;
         transferFrom(owner, address(this), nftId);
         auction[nftId].endAt = block.timestamp + 1 days;

         emit Endedat(auction[nftId].endAt);
      }

    function bid(uint nftId, address buyer, uint amount) public {
        require(auction[nftId].started, "not started");
        require(block.timestamp < auction[nftId].endAt, "ended");
        require(amount > auction[nftId].highestBid, "value < highest");

        if (auction[nftId].highestBidder != address(0)) {
            bids[nftId][auction[nftId].highestBidder] += auction[nftId].highestBid;
            // 
            //현재 가장 높은 입찰자의 입찰 금액에 
            //가장 높은 입찰자가 누군지도 알아야되서 
            //bids[highestBidder] 선언
            //300이더
        }
        token.transferFrom(buyer, address(this), amount);
        auction[nftId].highestBidder = buyer;
        auction[nftId].highestBid = amount;
    }

    function withdraw(address addr, uint nftId) public {
        uint bal = bids[nftId][addr];
        bids[nftId][addr] = 0;
        token.transferFrom(address(this), addr , bal);
       //NftWt가 Erc20을 호출, msg.sender = NftWt
       //
        emit Withdraw(addr, bal);
    }

    function end(uint nftId) public {
        require(auction[nftId].started, "not started");
        require(block.timestamp >= auction[nftId].endAt, "not ended");
        require(!auction[nftId].ended, "ended");

        auction[nftId].ended = true;
        if (auction[nftId].highestBidder != address(0)) {
            safeTransferFrom(address(this), auction[nftId].highestBidder, nftId);
            token.transferFrom(address(this), auction[nftId].owner, auction[nftId].highestBid);
        } else {
            safeTransferFrom(address(this), auction[nftId].owner, nftId);
        }
        emit End(auction[nftId].highestBidder, auction[nftId].highestBid);
    }
}


    