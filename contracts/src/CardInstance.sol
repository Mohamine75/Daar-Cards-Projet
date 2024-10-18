pragma solidity ^0.8;

import "./Main.sol";

contract CardInstance is ERC721 {
    using SafeMath for uint256;

    /** Décrit un modèle de carte */
    struct Card {
        string nom;
        uint id;
        string imageUrl; /** On stocke juste un id, l'URL sera "calculé" */
        uint32 prix; // en gros on met un prix par carte, ça va faciliter l'achat de carte par un autre joueur
        bool dispo;
    }
    Card cardType;
    uint globalId;



    constructor(Card memory _cardType, uint _globalId) {
        cardType = _cardType;
        globalId = _globalId;
    }


    mapping (uint => address) cardApprovals;
    /** _tokenId correspond à global */
    function ownerOf(uint256 _tokenId) public view override returns (address _owner) {
        return Main.cardToOwner[_tokenId];
    }

    function balanceOf(address _owner) public view override returns (uint256 _balance) {
        return Main.ownerCardCount[_owner];
    }

    modifier onlyOwnerOf(uint _cardId){
        require(msg.sender == Main.cardToOwner[_cardId]);
        _;
    }
    function _transfer(address _from, address _to, uint256 _tokenId) public {
        Main.ownerCardCount[_from] = Main.ownerCardCount[_from].sub(1);
        Main.ownerCardCount[_to] = Main.ownerCardCount[_to].add(1);
        Main.cardToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId)  {
        cardApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public override {
        require(cardApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}

