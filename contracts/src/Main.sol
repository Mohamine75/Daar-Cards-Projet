// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";
import "./CardFactory.sol";
import "./safemath.sol";

contract Main is Ownable {
  using SafeMath for uint256;

  int private count; /** nombre de collections */
  int private totalCardCount;
  mapping(int => Collection) private collections;
  mapping(uint16 => Card[]) public collectionToCards; /** Déplacer ? mapping idCollection => Card[] */
  mapping (address => uint) ownerCardCount;
  mapping (uint => address) public cardToOwner; /** id de la carte dans la collection donne un owner */

  event NewCard(string _name, string _imageUrlId, uint16 _collectionId, uint cardId);

  constructor() {
    count = 0;
    totalCardCount = 0;
  }

  function createCollection(string calldata name, int cardCount) external onlyOwner {
    collections[count] = new Collection(name, cardCount, count); /** On assigne à la collection un id unique */
    count = count.add(1);
  }

  function assignCard(address _to, uint _globalCardId) onlyOwner {
      cardToOwner[_globalCardId] = _to;
      /** TODO : Appeler un événement (comme Transfer) */
  }

  function _createCard(string _name, string _imageUrlId, uint16 _collectionId) external onlyOwner {
    require(collections[_collectionId].cards.size < collections[_collectionId].cardCount);
    uint cardIdInCollection = collections[_collectionId].cards.size;
    collections[_collectionId].cards.push(Card(_name, cardIdInCollection, _imageUrlId));
    NewCard(_name, _imageUrlId, _collectionId, cardId);
  }

  function openBooster(uint16 _collectionId, uint _amountOfCards, address _to) {
    /** TODO : rentre ça payant */
    for (uint i = 0; i < _amountOfCards; i++) {
      /** TODO : modifier la façon de générer rand ! */
      uint rand = uint(keccak256("modifier"));
      uint cardIdInCollection = rand % collections[_collectionId].cards.size;
      uint globalId = totalCardCount;
      totalCardCount = totalCardCount.add(1);
      CardInstance storage card = new CardInstance(collections[_collectionId].cards[cardIdInCollection], globalId);
      assignCard(_to, globalId);
    }
  }
}

  /** TODO : faire une fonction d'échange avec événement */
  /** TODO : faire une fonction d'achat avec événement | Ajouter un fee de transfert, pour récupérer de l'argent sur les ventes de cartes hehe
              => Ne pas oublier le modifier onlyOwner pour les fonctions de modification de frais de transfert et de withdraw
    */