// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./CardInstance.sol";
import "./safemath.sol";

contract Collection {
  string public name;
  int public cardCount;
  uint16 id;
  CardInstance[] public cards;


  constructor(string memory _name, int _cardCount, uint16 _id) {
    name = _name;
    cardCount = _cardCount;
    id = _id;
  }
}
