// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CardInstance.sol";
import "./safemath.sol";

contract Collection {
  string public name;
  uint public cardCount;
  uint16 id;
  CardInstance[] public cards;


  constructor(string memory _name, uint _cardCount, uint16 _id) {
    name = _name;
    cardCount = _cardCount;
    id = _id;
  }
}
