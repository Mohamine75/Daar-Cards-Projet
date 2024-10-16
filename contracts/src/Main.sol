// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";
import "./CardFactory.sol";
import "./CardOwnership.sol";
import "./safemath.sol";
import "./erc721.sol";
import "./CardInstance.sol";

contract Main is Ownable {
  using SafeMath for uint256;

  uint private count; /** nombre de collections */
  uint private totalCardCount;
  mapping(uint => Collection) private collections;
  //mapping(uint16 => Card[]) public collectionToCards; /** Déplacer ? mapping idCollection => Card[] */
  mapping (address => uint) public ownerCardCount;
  mapping (uint => address) public cardToOwner;
    mapping(uint => address) public cardApprovals;    /** Approbations pour transfert de cartes */
    CardInstance[] public cards;        /** Cartes existantes */
   uint public openBoosterFee = 0.001 ether;
  event NewCard(string _name, string _imageUrlId, uint16 _collectionId, uint cardId,uint prix,bool dispo);
  constructor() {
    count = 0;
    totalCardCount = 0;
  }

  function createCollection(string calldata name, int cardCount) external onlyOwner {
    collections[count] = new Collection(name, cardCount, count); /** On assigne à la collection un id unique */
    count = count.add(1);
  }

  function assignCard(address _to, uint _globalCardId) external onlyOwner {
      cardToOwner[_globalCardId] = _to;
      ownerCardCount[_to].add(1);
      /** DONE : Appeler un événement (comme Transfer) */
      emit  Transfer(msg.sender,_to,_globalCardId);
  }

  function _createCard(string _name, string _imageUrlId, uint16 _collectionId) external onlyOwner {
    require(collections[_collectionId].cards.size < collections[_collectionId].cardCount);
    uint cardIdInCollection = collections[_collectionId].cards.size;
    collections[_collectionId].cards.push(Card(_name, cardIdInCollection, _imageUrlId));
    emit NewCard(_name, _imageUrlId, _collectionId, cardId,0,false);
  }

  function openBooster(uint16 _collectionId, uint _amountOfCards, address _to) external payable {
    /** DONE : rentre ça payant */
    require(msg.value == openBoosterFee);
    for (uint i = 0; i < _amountOfCards; i++) {
      /** TODO : modifier la façon de générer rand ! */
      uint rand = uint(keccak256("modifier"));
      uint cardIdInCollection = rand % collections[_collectionId].cards.size;
      uint globalId = totalCardCount;
      totalCardCount = totalCardCount.add(1);
      CardInstance storage card = new CardInstance(collections[_collectionId].cards[cardIdInCollection], globalId,false,0);
      assignCard(_to, globalId);
    }
  }
    function setOpeningBoosterFee(uint _fee) external onlyOwner {
        openBoosterFee = _fee;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function achat(uint256 _cardId) external payable {
        require(msg.value == cards[_cardId].prix);
        _transfer(cardToOwner[_cardId], msg.sender, _cardId);
    }


}
  /** TODO : faire une fonction d'échange avec événement // faite */
  /** TODO : faire une fonction d'achat avec événement | Ajouter un fee de transfert, pour récupérer de l'argent sur les ventes de cartes hehe
              => Ne pas oublier le modifier onlyOwner pour les fonctions de modification de frais de transfert et de withdraw // fait
    */