// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.6;

import "../klaytn-contracts-master/contracts/token/KIP7/KIP7TokenFull.sol";


contract WTToken is KIP7TokenFull {
    uint256 _amountToken;
    
    
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
        bool SerialStatus;
          
        bool contentStatus;
        //
    }
    mapping(uint => Game) rooms; // rooms[0], rooms[1] 형식으로 접근할 수 있으며, 각 요소는 Game 구조체 형식입니다.
    //  mapping(uint => mapping(Game => Serials))rooms;
      // rooms[0], rooms[1] 형식으로 접근할 수 있으며, 각 요소는 Game 구조체 형식입니다.
    // mapping(uint => Serials) serials;  // 각 회차마다 유효성검사를 위해서 맏ㄹ

    uint roomLen = 0; // rooms의 키 값입니다. 방이 생성될 때마다 1씩 올라갑니다.
    event total(uint256 roomNumber,uint price);
    event userInfo(uint256 roomNumber, address user, string select,uint256 amount);
    event check(uint onePay);
    event countPeople(uint256 contentNumber, string result, uint256 totalCount,uint256 onePay);
    event showContentNumber (uint256 num);


    constructor() public KIP7TokenFull("WTToken", "WT", 18, 0) {
    }
     

     //1.WTTOKEN을 발행해주는 메서드 
    function mintToken(address to, uint256 amount) public returns (bool) {
        require(to != address(0x0));
        require(amount > 0);
        _mint(to, amount);
        _approve(to, msg.sender, allowance(to, msg.sender)+amount);  // approve 추가
        // _approve(to, contractAddress, allowance(to, contractAddress) + amount);  // approve 추가  => 베팅 컨트렉트 연결
        return true;
    }

    //transferFrom 함수로 인해 spender부분 때문에 만들어 놓은 함수 
    function approveToken(address owner,address spender)  public {
         uint256 amount = balanceOf(owner);
        _approve(owner,spender,amount);
    }

    

    // 교환해주는 함수
    function exchange(address _to, uint256 price) public onlyOwner returns (bool) {
        require(_to != address(0x0));
        require(balanceOf(msg.sender) > 0);
        _amountToken = (price * 1e18) / 1000;  // 가라로 고정으로 설정 (원화)
        require(balanceOf(msg.sender) >= _amountToken);
        _transfer(msg.sender, _to, _amountToken);
        return true;
    }

  
     // 배팅에 관련된 함수 시작 

     // 1.베팅할 수 있는 방을 개설하는 함수.
      function createContent () public returns (uint roomNum){
     rooms[roomLen].SerialStatus = true;
     rooms[roomLen].contentStatus = true;
     roomNum = roomLen;
     roomLen++;
     emit showContentNumber(roomLen);
    }

     // 2. 유효성검사를 해주는 함수.
     function validVoter(address voter, uint roomNum) view public returns(bool){
        for(uint i=0; i<rooms[roomNum].taker.length; i++){
           if(voter == rooms[roomNum].taker[i].addr){
               return false;
           }
        }
        return true;
    }
     // 3.투표하는 함수
     function vote (uint roomNum,string memory select) public  {
        uint price = 10e18;
        //address user = msg.sender;
        require(rooms[roomNum].SerialStatus == true,"cloesed SerialContents");
        require(rooms[roomNum].contentStatus == true,"cloesed AllContents");
        require(validVoter(msg.sender,roomNum), "duplicate is not!!!");
        //   require(msg.sender == user, "owner do not vote that");
        require(balanceOf(msg.sender)>price,"you do not have money");
        transfer(address(this),price);
        rooms[roomNum].taker.push(Player(msg.sender,price,select));
        rooms[roomNum].amount += price;
    }
     

      //4.총 얼마만큼 투표했는지 확인하는 함수. 
        function checkAmount (uint roomNum) public {
        emit total(roomNum,rooms[roomNum].amount);  
    }
 

    // 컨텐츠가 종료되고난 후 새롭게 컨테츠 베팅방을 만들 때 사용하는 메서드.
    // function increaseLoomLen() public onlyOwner {
    //    roomLen++;
    // }

    // 5.시간이 종료되면 투표를 막을 수 있는 장치를 만들어 놨다.
    function closeSerialContent(uint roomNum) public onlyOwner {
        rooms[roomNum].SerialStatus=false;
    }
    function openSerialContent(uint roomNum) public onlyOwner {
        rooms[roomNum].SerialStatus=true;
    }
    function closeContent(uint roomNum) public onlyOwner {
        rooms[roomNum].contentStatus=false;
    }
    
    
    // 6.회차로인해서 다시 true로 변경해서 투표를 할 수 있게 합니다. 
    // 정답을 맞춘 인원이 몇명이니지 계산해보자. 
    function CountWinner(string memory res, uint roomNum) public onlyOwner returns(uint256){
         uint256 count;

        for(uint i=0; i<rooms[roomNum].taker.length; i++){
               if(keccak256(abi.encodePacked(res)) == keccak256(abi.encodePacked(rooms[roomNum].taker[i].vote))){
                    count++;
               }
           }

           uint onePay = rooms[roomNum].amount / count;
           emit countPeople(roomNum,res,count,onePay);
           return onePay;

    }

    // 7.정산해 주는 로직을 작성해봅시다. 
    // 정답을 입력해 주면 정답을 맞춘 주소에게 알아서 토큰이 분배됩니다.
    function payOut(string memory res, uint roomNum) public onlyOwner {
    
    require(rooms[roomNum].contentStatus == false,"still open contentsRoom");
        
       uint256 payOne = CountWinner(res,roomNum);
           for(uint i=0; i<rooms[roomNum].taker.length; i++){
               if(keccak256(abi.encodePacked(res)) == keccak256(abi.encodePacked(rooms[roomNum].taker[i].vote))){
                _transfer(address(this),rooms[roomNum].taker[i].addr,payOne);                     
               }
           }
      
        emit check(payOne);
    }

  
 


    
}