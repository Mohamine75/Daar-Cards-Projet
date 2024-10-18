// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";
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
  uint public openBoosterFee = 0.001 ether;
  CardInstance[] public cards;

  event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
  event NewCard(string _name, string _imageUrlId, uint16 _collectionId, uint cardId,uint prix,bool dispo);

  constructor() {
    count = 0;
    totalCardCount = 0;
  }

  function createCollection(string calldata name, uint cardCount) external onlyOwner {
    collections[count] = new Collection(name, cardCount, count); /** On assigne à la collection un id unique */
    count = count.add(1);
  }

  function assignCard(address _to, uint _globalCardId) internal onlyOwner {
      cardToOwner[_globalCardId] = _to;
      ownerCardCount[_to].add(1);
      /** DONE : Appeler un événement (comme Transfer) */
      emit Transfer(msg.sender,_to,_globalCardId);
  }

  function _createCard(string memory _name, string memory _imageUrlId, uint16 _collectionId) external onlyOwner {
    // TODO :require(collections[_collectionId].collectionCards.length < collections[_collectionId].cardCount);
    Collection tmp = collections[_collectionId];
    uint cardIdInCollection = tmp.getCurrentCardCount();
    tmp.addCardToCollection(CardInstance.Card(_name, cardIdInCollection, _imageUrlId,0,false));
    emit NewCard(_name, _imageUrlId, _collectionId, cardIdInCollection,0,false);
  }

  function openBooster(uint16 _collectionId, uint _amountOfCards, address _to) external payable {
    /** DONE : rentre ça payant */
    require(msg.value == openBoosterFee);
    for (uint i = 0; i < _amountOfCards; i++) {
      /** TODO : modifier la façon de générer rand ! */
      uint rand = uint(keccak256("modifier"));
      uint cardIdInCollection = rand % collections[_collectionId].getCurrentCardCount();
      uint globalId = totalCardCount;
      totalCardCount = totalCardCount.add(1);
      CardInstance card = new CardInstance(collections[_collectionId].cards[cardIdInCollection], globalId,false,0);
      cards.push(card);
      assignCard(_to, globalId);
      cards.push(CardInstance(collections[_collectionId].cards[cardIdInCollection], globalId,false,0));
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
        CardInstance._transfer(cardToOwner[_cardId], msg.sender, _cardId);
    }

  function changer_prix(uint256 _cardId,uint32 _prix) external onlyOwnerOf(_cardId){
    cards[_cardId].Card.prix = _prix;
  }
  function mettre_en_vente(uint256 _cardId) external onlyOwnerOf(_cardId){
    cards[_cardId].Card.dispo = true;
  }
  function retirer_de_vente(uint256 _cardId) external onlyOwnerOf(_cardId){
    cards[_cardId].Card.dispo = false;
  }

  /** TODO : faire une fonction d'échange avec événement // faite */
  /** TODO : faire une fonction d'achat avec événement | Ajouter un fee de transfert, pour récupérer de l'argent sur les ventes de cartes hehe
              => Ne pas oublier le modifier onlyOwner pour les fonctions de modification de frais de transfert et de withdraw // fait
    */

  function getCardsByOwner(address _owner) external view returns (uint[] memory) {
    uint cardCount = ownerCardCount[_owner]; // Nombre de cartes possédées par l'adresse
    uint[] memory ownedCardIds = new uint[](cardCount); // Tableau pour stocker les IDs des cartes

    uint index = 0;
    for (uint i = 0; i < totalCardCount; i++) { // Parcours de toutes les cartes
      if (cardToOwner[i] == _owner) { // Vérifie si l'adresse correspond au propriétaire de la carte
        ownedCardIds[index] = i; // Ajoute l'ID de la carte au tableau
        index++;
      }
    }

    return ownedCardIds; // Retourne le tableau des IDs des cartes
  }
  function getCardDetails(uint _cardId) external view returns (CardInstance.Card memory) {
    require(_cardId < cards.length, "Card does not exist."); // Vérifie que la carte existe
    return cards[_cardId].cardType; // Retourne les détails de la carte
  }

  modifier onlyOwnerOf(uint _cardId){
    require(msg.sender == Main.cardToOwner[_cardId]);
    _;
  }
}
  // Le globalId de cardIstance c'est sa position dans Collection
