// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Card.sol";

contract Collection {
  string public name;
  int public cardCount;
  mapping(address => Card[]) collection_de_cartes;




  constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }
  function _get_cards()public view {
    return collection_de_cartes[msg.sender];
  }
}
