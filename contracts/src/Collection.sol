// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./CardFactory.sol";
import "./safemath.sol";

contract Collection {
  string public name;
  int public cardCount;
  uint16 id;
  Card[] public cards;


  constructor(string memory _name, int _cardCount, uint16 _id) {
    name = _name;
    cardCount = _cardCount;
    id = _id;
  }
}
