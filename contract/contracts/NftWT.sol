
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
    import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
    import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
    import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
    import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

 
    contract WATTONFT is ERC721URIStorage, Ownable {
        using Counters for Counters.Counter;
        Counters.Counter private _tokenIds;

        IERC20 public token;  //IERC20 함수를 사용한다. 위함이다 setToken을 먼저 해줄 수 있도록 
        uint256 public nftPrice; // nft 가격을 정하기위해서 만들어논 상태변수 

        event NewNft(address owner,uint256 tokenId,string tokenUri);

        mapping (string => uint256) public getTokenId;   // tokenUri를 key값으로하는 tokenId를 얻기위한 맵핑 tokenId가 재대로반환이 되지않아서 만들어 놓았다.
        mapping (uint256 => uint256) public tokenPrice;   // 토큰아이디를 통해서 해당 nft의 가격을 알 수 있게 만들어 놓은 맵핑 

        constructor() ERC721("WATTONFTs", "WTNFT") {}   


    //-------------------함수시작 ------------- 
    //*참고사항* 서버중앙화 방식을 사용하기 때문에 onlyOwner가 들어가있고 
    //이때의  onwer 및 msg.sender가 어떻게 되는지 생각하면서 함수를 짜야한다.


    //1. setToken erc20컨트랙주소를 가져와서 IERC20에 접근하여 IERC20의 함수를 사용가능 
    //    IERC20함수의 member가 무엇이 있는지 정확하게 파악하고 사용할 것. 
    function setToken (address tokenAddress) public onlyOwner returns (bool) {
            require(tokenAddress != address(0x0));
            token = IERC20(tokenAddress);
            return true;
        }


    //2. mintNFT erc721에 있는 _mint함수를 이용해서 유일한 토큰을 생성하는 함수 
    // 밑에 nft발행방식은 누군가에게 발헹해주는 방식이 아닌 서버계정 자체에 nft를 발행해주는 함수.
        function mintNFT(string memory tokenURI,uint256 price) public onlyOwner returns (uint256) {
            
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            tokenPrice[newItemId] = price;
            _setTokenURI(newItemId, tokenURI); 
            emit NewNft(msg.sender,newItemId,tokenURI);
            getTokenId[tokenURI] = newItemId;  // 맵핑을 통해서 tokendI를 tokenUri와 맵핑해준다. 이방식은 tokenUri가 유일해야 한다는 전제가 필요하다.
        
            return newItemId;
        }

    // 3. approveSale함수를 사용해서 소유자가 msg.seder에게 대납소유권을 허락해주는 방식. 그래야지 safeTransferFrom을 사용할 수 가 있다.
        function approveSale(address receipent) onlyOwner public {
            _setApprovalForAll(receipent, msg.sender, true);
        }

        

        // 4.setForSale함수를 이용해서 소유자가 tokenId에 가격을 지정할 수 있다. 
        function setForSale(uint256 _tokenId, uint256 _price) public onlyOwner {
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

        function purchaseToken(uint256 _tokenId,address buyer) public onlyOwner {
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


       // 이 밑에부분은 call vs delegatecall을 test하기위한 함수이다.
        function sendToken(address sender,address receipent,uint256 amount,address _contract)public returns(uint){
         (bool data, ) = _contract.call(abi.encodeWithSignature("send(address,address,uint256)",sender,receipent,amount));
          if(data == true){
              return 1;
          }
        }

        function tests(address _contract,address addr) public returns(bool){
            (bool success, ) = _contract.call(abi.encodeWithSignature("blof(address)",addr));
            return success;
        }


        

    }