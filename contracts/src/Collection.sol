// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./CardInstance.sol";
import "./safemath.sol";

contract Collection {
  using SafeMath for uint256;

  string public name;
  uint public cardCount;
  uint public currentCardCount;
  uint id;
  CardInstance.Card[] public collectionCards;


  constructor(string memory _name, uint _cardCount, uint _id) {
    name = _name;
    cardCount = _cardCount;
    currentCardCount = 0;
    id = _id;
  }

  function getCurrentCardCount() public view returns (uint) {
    return currentCardCount;
  }

  function addCardToCollection(CardInstance.Card memory _card) public {
      require(currentCardCount < cardCount, "Collection is full"); // Vérifie que la collection n'est pas pleine
      collectionCards.push(_card); // Ajoute la carte à la fin du tableau
      currentCardCount = currentCardCount.add(1);
  }

  function getCard(uint _id) public view returns (CardInstance.Card memory) {
      require(_id < currentCardCount, "Card ID is out of bounds"); // Vérifie que l'ID de la carte est valide
      return collectionCards[_id];
  }
}
