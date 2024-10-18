// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./CardInstance.sol";
import "./safemath.sol";

contract Collection {
  using SafeMath for uint256;

  string public name;
  uint public cardCount;
  uint currentCardCount;
  uint id;
  CardInstance.Card[] public collectionCards;


  constructor(string memory _name, uint _cardCount, uint _id) {
    name = _name;
    cardCount = _cardCount;
    currentCardCount = 0;
    id = _id;
  }

  function getCurrentCardCount() public returns (uint) {
    return currentCardCount;
  }

  function addCardToCollection(CardInstance.Card memory _card) public returns (uint) {
    collectionCards[currentCardCount] = _card;
    currentCardCount = currentCardCount.add(1);
  }
}
