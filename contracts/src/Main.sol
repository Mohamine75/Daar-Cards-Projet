// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";
import "./safemath.sol";
import "./erc721.sol";
import "./CardInstance.sol";

interface ICardInstance {

    struct Card {
        string nom;
        uint id;
        string imageUrl; // TODO supprimer après une meilleure utilisation de l'API
        uint32 prix;
        bool dispo;
    }

    struct CardInstanceStruct {
        Card cardType;
        uint globalId;
    }

    function ownerOf(uint256 _tokenId) external view returns (address _owner);

    function balanceOf(address _owner) external view returns (uint256 _balance);

    function transfer(address _to, uint256 _tokenId) external;

    function approve(address _to, uint256 _tokenId) external;

    function takeOwnership(uint256 _tokenId) external;

    function assign(address _to, uint _globalCardId) external;

    function incrementOwnerCardCount(address _to) external;

    function getOwnerCardCount(address _to) external view returns (uint);

    function getCardOwner(uint _cardId) external view returns (address);

    function setCardOwner(uint _cardId, address _owner) external;
}

contract Main is Ownable {
    using SafeMath for uint256;
    event Debug(string message, address owner);
    ICardInstance internal cardInstance;
    uint private count; /** nombre de collections */
    uint private totalCardCount;
    mapping(uint => Collection) private collections;
    //mapping(uint16 => Card[]) public collectionToCards; /** Déplacer ? mapping idCollection => Card[] */

    // mapping(uint => address) public cardApprovals;    /** Approbations pour transfert de cartes */
    uint public openBoosterFee = 0 ether;
    CardInstance.CardInstanceStruct[] public cards;

    event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
    event NewCard(string _name, string _imageUrlId, uint16 _collectionId, uint cardId,uint prix,bool dispo);

    constructor(address _cardInstanceAddress) {
        //_cardInstanceAddress = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
        owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        count = 0;
        totalCardCount = 0;
        cardInstance = ICardInstance(_cardInstanceAddress);
        collectionTest();
    }

    function collectionTest() internal onlyOwner {
        collections[count] = new Collection("test1", 20, 0); /* On assigne à la collection un id unique */
        count = count.add(1);
    }


    function createCollection(string calldata name, uint cardCount) external onlyOwner {
        collections[count] = new Collection(name, cardCount, count); /** On assigne à la collection un id unique */
        count = count.add(1);
    }

    function assignCard(address _to, uint _globalCardId) public onlyOwner {
        //CardInstance.cardToOwner[_globalCardId] = _to;
        cardInstance.assign(_to, _globalCardId);
        
        /** DONE : Appeler un événement (comme Transfer) */
        emit Transfer(msg.sender,_to,_globalCardId);
    }

    function createCard(string memory _name, string memory _imageUrl, uint16 _collectionId) public onlyOwner {
        // TODO require(collections[_collectionId].collectionCards.length < collections[_collectionId].cardCount);
        Collection tmp = collections[_collectionId];
        uint cardIdInCollection = tmp.getCurrentCardCount();
        CardInstance.Card memory card = CardInstance.Card(_name, cardIdInCollection, _imageUrl, 0,false);
        tmp.addCardToCollection(card);
        cards.push(CardInstance.CardInstanceStruct(card, totalCardCount));
        totalCardCount = totalCardCount.add(1);
        emit NewCard(_name, _imageUrl, _collectionId, cardIdInCollection,0,false);
    }

    function openBooster(uint16 _collectionId, uint _amountOfCards, address _to) public payable {
        require(msg.value == openBoosterFee, "Incorrect fee");
        require(collections[_collectionId].getCurrentCardCount() >= _amountOfCards, "Not enough cards in collection");

        uint availableCardCount = collections[_collectionId].getCurrentCardCount();
        uint nonce = 0;

        for (uint i = 0; i < _amountOfCards; i++) {
            // Générer un nombre aléatoire basé sur le block.timestamp et un nonce pour varier
            uint rand = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % availableCardCount;
            nonce++;  // Augmenter le nonce pour chaque tirage

            // Obtenir l'ID de la carte dans la collection
            uint cardIdInCollection = rand;

            // Obtenir l'ID global de la nouvelle carte et l'incrémenter
            uint globalId = totalCardCount;
            totalCardCount = totalCardCount.add(1);

            // Créer une instance de la carte à partir de la carte dans la collection
            CardInstance.CardInstanceStruct memory card = CardInstance.CardInstanceStruct(
                collections[_collectionId].getCard(cardIdInCollection),
                globalId
            );

            // Ajouter la carte à la liste globale des cartes et assigner au joueur
            cards.push(card);
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



    /** TODO : faire une fonction d'échange avec événement // faite */
    /** TODO : faire une fonction d'achat avec événement | Ajouter un fee de transfert, pour récupérer de l'argent sur les ventes de cartes hehe
                => Ne pas oublier le modifier onlyOwner pour les fonctions de modification de frais de transfert et de withdraw // fait
      */

    function getCardsByOwner(address _owner) external view returns (uint[] memory) {
        uint cardCount = cardInstance.getOwnerCardCount(_owner); // Nombre de cartes possédées par l'adresse
        uint[] memory ownedCardIds = new uint[](cardCount); // Tableau pour stocker les IDs des cartes

        uint index = 0;
        for (uint i = 0; i < totalCardCount; i++) { // Parcours de toutes les cartes
            if (cardInstance.getCardOwner(i) == _owner) { // Vérifie si l'adresse correspond au propriétaire de la carte
                ownedCardIds[index] = i; // Ajoute l'ID de la carte au tableau
                index++;
            }
        }

        // require(ownedCardIds[1] > 0);
        return ownedCardIds; // Retourne le tableau des IDs des cartes
    }

    //   return ownedCardIds; // Retourne le tableau des IDs des cartes
    // }

    modifier onlyOwnerOf(uint _cardId){
        require(msg.sender == cardInstance.getCardOwner(_cardId));
        _;
    }

    function getCardDetails(uint _cardId) public view returns(string memory nom, uint id, string memory imageUrl, uint32 prix, bool dispo){
        require(totalCardCount > _cardId);
        // string nom;
        // uint id;
        // string imageUrl; /** On stocke juste un id, l'URL sera "calculé" */
        // uint32 prix; // en gros on met un prix par carte, ça va faciliter l'achat de carte par un autre joueur
        // bool dispo;
        CardInstance.Card memory tmp = cards[_cardId].cardType;
        return (tmp.nom, tmp.id, tmp.imageUrl, tmp.prix, tmp.dispo);
    }
    // Le globalId de cardIstance c'est sa position dans Collection



    function getAllCardIdsFromCollections() public view returns (uint[] memory) {
        // D'abord, on compte combien de cartes au total sont dans toutes les collections
        uint totalCards = 0;
        for (uint i = 0; i < count; i++) {
            totalCards = totalCards.add(collections[i].getCurrentCardCount());
        }

        // On crée un tableau dynamique pour stocker tous les cardIds
        uint[] memory allCardIds = new uint[](totalCards);

        uint index = 0; // Indice pour insérer les cardIds dans le tableau

        // Ensuite, on parcourt chaque collection et on extrait les cardIds
        for (uint i = 0; i < count; i++) {
            uint cardCountInCollection = collections[i].getCurrentCardCount();

            // Parcourir chaque carte dans la collection et récupérer son id
            for (uint j = 0; j < cardCountInCollection; j++) {
                allCardIds[index] = collections[i].getCard(j).id; // On ajoute le cardId à la bonne position
                index = index.add(1); // On incrémente l'indice
            }
        }

        return allCardIds; // Retourne le tableau avec tous les cardIds
    }

    function getCollectionIdFromCardId(uint _cardId) public view returns(uint){
        uint res = 0;
        for (uint i = 0; i < count; i++) {
            Collection collection = collections[i];
            for(uint j = 0; j<collection.cardCount();j++){
                if(collection.getCard(j).id == _cardId){
                    return i;
                }
            }

        }
        return res;
    }

    function getCollectionName(uint _collectionId) public view returns(string memory){
        return collections[_collectionId].name();
    }

    function getCountCards() public view returns(uint){
        return totalCardCount;
    }



}