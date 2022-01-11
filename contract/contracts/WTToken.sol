// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./Price.sol";

contract WTToken is ERC20, Ownable, Price {
    uint256 _amountToken;
    // mapping(address => uint256) private _balances;
    // uint256 private _totalSupply;
    // Price _price;
    // mapping(address => uint256) private _balances;

    constructor() ERC20("WToken", "WT") {
    }

    function mintToken(address to, uint256 amount) public onlyOwner returns (bool) {
        require(to != address(0x0));
        require(amount > 0);
        _mint(to, amount);
        // _approve(to, msg.sender, allowance(to, msg.sender)+amount);  // approve 추가
        // _approve(to, contractAddress, allowance(to, contractAddress) + amount);  // approve 추가

        return true;
    }   

    function getPrice() public view returns (uint256) {
        return _price;
    }

    function exchange(address _to) public onlyOwner returns (bool) {
        require(_to != address(0x0));
        require(balanceOf(msg.sender) > 0);
        _amountToken = (_price * 1e18) / 1000;  // 가라로 고정으로 설정 (원화)
        require(balanceOf(msg.sender) >= _amountToken);
        _transfer(msg.sender, _to, _amountToken);
        return true;
    }    

    function test () public view returns (uint256) {
        return _amountToken;
    }

//  function withdraw(uint amountInCents) returns (uint amountInWei){
//     assert(amountInCents <= balanceOf(msg.sender));
//     amountInWei = (amountInCents * 1 ether) / priceOracle.price();

//     if(this.balance <= amountInWei) {
//       amountInWei = (amountInWei * this.balance * priceOracle.price()) / (1 ether * _totalSupply);
//     }

//     balances[msg.sender] -= amountInCents;
//     _totalSupply -= amountInCents;
//     msg.sender.transfer(amountInWei);
//   }

    function multiMintToken(address[] calldata toArr, uint256[] calldata amountArr) public onlyOwner returns (bool) {
        require(toArr.length == amountArr.length);
        for (uint256 i=0; i<toArr.length; i++) {
            require(toArr[i] != address(0x0));
            require(amountArr[i] > 0);
            _mint(toArr[i], amountArr[i]);
            _approve(toArr[i], msg.sender, allowance(toArr[i], msg.sender) + amountArr[i]);
        }
        return true;
    }
}