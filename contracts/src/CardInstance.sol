pragma solidity ^0.8;

import "./Main.sol";

contract CardInstance is ERC721, Ownable {
    using SafeMath for uint256;

    /** Décrit un modèle de carte */
    struct Card {
        string nom;
        uint id;
        string imageUrl; /** On stocke juste un id, l'URL sera "calculé" */
        uint32 prix; // en gros on met un prix par carte, ça va faciliter l'achat de carte par un autre joueur
        bool dispo;
    }
    struct CardInstanceStruct {
        Card cardType;
        uint globalId;
    }

    //constructor (address  owner) Ownable(owner){}

    mapping (address => uint) public ownerCardCount;
    mapping (uint => address) public cardToOwner;

    mapping (uint => address) cardApprovals;
    /** _tokenId correspond à global */
    function ownerOf(uint256 _tokenId) public view override returns (address _owner) {
        return cardToOwner[_tokenId];
    }

    function balanceOf(address _owner) public view override returns (uint256 _balance) {
        return ownerCardCount[_owner];
    }

    modifier onlyOwnerOf(uint _cardId){
        require(msg.sender == cardToOwner[_cardId]);
        _;
    }
    function _transfer(address _from, address _to, uint256 _tokenId) public {
        ownerCardCount[_from] = ownerCardCount[_from].sub(1);
        ownerCardCount[_to] = ownerCardCount[_to].add(1);
        cardToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId)  {
        cardApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public override {
        require(cardApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }

    // function getPrix() public view returns (uint32) {
    //     return cardType.prix;
    // }

    // todo : FIX ces fonctions, elles sont facultatives, si elles posent problème, on les vire
    // function achat(uint256 _cardId) external payable {
    //     require(msg.value == Main.cards[_cardId].getPrix());
    //     _transfer(Main.cardToOwner[_cardId], msg.sender, _cardId);
    // }
//   function changer_prix(uint256 _cardId,uint32 _prix) external onlyOwnerOf(_cardId){
//     Main.cards[_cardId].setPrix(_prix);
//   }
//   function mettre_en_vente(uint256 _cardId) external onlyOwnerOf(_cardId){
//     Main.cards[_cardId].Card.dispo = true;
//   }
//   function retirer_de_vente(uint256 _cardId) external onlyOwnerOf(_cardId){
//     Main.cards[_cardId].Card.dispo = false;
//   }

//   function getCardDetails(uint _cardId) external view returns (CardInstance.Card memory) {
//     require(_cardId < Main.cards.length, "Card does not exist."); // Vérifie que la carte existe
//     return Main.cards[_cardId].cardType; // Retourne les détails de la carte
//   }

  function assign(address _to, uint _globalCardId) external /*onlyOwner*/ {
    cardToOwner[_globalCardId] = _to;
  }

  function incrementOwnerCardCount(address _to) public onlyOwner {
      if(ownerCardCount[_to] == 0) {
          ownerCardCount[_to] = 1;
      }else{
    ownerCardCount[_to] = ownerCardCount[_to].add(1);
      }
  }

  function getOwnerCardCount(address _to) public view returns(uint) {
    return ownerCardCount[_to];
  }

  function getCardOwner(uint _cardId) public view returns (address) {
    return cardToOwner[_cardId];
  }
  
  function setCardOwner(uint _cardId, address _owner) public onlyOwner {
    cardToOwner[_cardId] = _owner;
  }
}

