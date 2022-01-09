// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "./PriceInterface.sol";

// 1200 원 : WT 1개
// 돈 지불 -> 토큰으로 전환

contract Price is PriceInterface {
    // mapping (address => uint256) _price;
    uint256 public _price;

    function setPrice(uint256 price) public {
      _price = price;
    }

    function price() public override view returns (uint256){
      return _price;
    }
}