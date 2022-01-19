
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 1. 서버계정이 투표할 수 있는 방을 만든다. -> createContent 
// 2. 컨텐츠 투표방이 개설이 되면 user들이 투표를 한다.  -> 
// 3. 투표를 종료함과 동시에 다음 컨텐츠 방이 배포될 준비를 한다.  -> increase -> createContent
// 4. 결과를 대입하고 돈 정산준비를 한다.  
// 5. 정산이 끝났으면 승리한 user들에게 상금을 배분한다. 
// 6. 새롭게 배팅할 수 있는 컨텐츠방을 개설한다.


contract Voting {
IERC20 public tokenCA;
//배팅을 하는 플레이어에 대한 구조체
    struct Player {
        address  addr;
        // 주소
        uint256 playerBetAmount;
        // 베팅 금액
        string vote;
        // 후보에게 베팅
    }
  


 struct Game {
        Player[] taker;
           // 참여자 정보
        uint256 amount;
        // 배팅금액 총액
        bool status;
    }
    
    mapping(uint => Game) rooms; // rooms[0], rooms[1] 형식으로 접근할 수 있으며, 각 요소는 Game 구조체 형식입니다.
    uint roomLen = 0; // rooms의 키 값입니다. 방이 생성될 때마다 1씩 올라갑니다.


     //
     function createContent () public onlyOwner returns (uint roomNum){
     rooms[roomLen];
     rooms[roomLen].status = true;
     roomNum = roomLen;
    }

     function validVoter(address voter) view public returns(bool){
    
        for(uint i=0; i<rooms[roomLen].taker.length; i++){
           if(voter == rooms[roomLen].taker[i].addr){
               return false;
           }
        }
        return true;
    }

    event userInfo(uint256 roomNumber, address user, string select,uint256 amount);

     function voteRoom (address user,string memory select) public {
        uint price = 10e18;
        require(rooms[roomLen].status == true,"cloesed Content");
        require(validVoter(user), "duplicate is not!!!");
        require(tokenCA.balanceOf(user)>price,"you do not have money");
       
        tokenCA.transferFrom(user,address(this),price);
        rooms[roomLen].taker.push(Player(user,price,select));
        rooms[roomLen].amount += price;
        emit userInfo(roomLen,user,select,rooms[roomLen].amount);
    }
     

        event total(uint256 roomNumber,uint price);
        function checkAmount () public {
        emit total(roomLen,rooms[roomLen].amount);  
    }
 
    //erc20 토큰이랑 연결해주기 
      function setToken (address tokenAddress) public returns (bool) {
        require(tokenAddress != address(0x0));
        tokenCA = IERC20(tokenAddress);
        return true;
      }

    // 컨텐츠가 종료되고난 후 새롭게 컨테츠 베팅방을 만들 때 사용하는 메서드.
    function increaseLoomLen() public {
       roomLen++;
    }
    // 시간이 종료되면 투표를 막을 수 있는 장치를 만들어 놨다.
    function closeContent() public {
        rooms[roomLen].status=false;
    }
    
    event countPeople(uint256 contentNumber, string result, uint256 totalCount,uint256 onePay);
    // 정답을 맞춘 인원이 몇명이니지 계산해보자. 
    function CountWinner(string memory res) public returns(uint256){
         uint256 count;

        for(uint i=0; i<rooms[roomLen].taker.length; i++){
               if(keccak256(abi.encodePacked(res)) == keccak256(abi.encodePacked(rooms[roomLen].taker[i].vote))){
                    count++;
               }
           }

           uint onePay = rooms[roomLen].amount / count;
           emit countPeople(roomLen,res,count,onePay);
           return onePay;

    }

    //정산해 주는 로직을 작성해봅시다. 
    event check(uint onePay);
    
    function payOut(string memory res) public {
       uint plus = 0;
    //    uint onePay = 10e18;
       // 몇명이 우승자를 맞췄는지 숫자를 확인하고.
           for(uint i=0; i<rooms[roomLen].taker.length; i++){
               if(keccak256(abi.encodePacked(res)) == keccak256(abi.encodePacked(rooms[roomLen].taker[i].vote))){
                  tokenCA.transferFrom(address(this),rooms[roomLen].taker[i].addr,10000000000000000000);
                
               }
           }
      
        emit check(plus);
    }

    function sendToken(address addr) public {
        tokenCA.transferFrom(address(this),addr,10000000000000000000);
    }
 

}
