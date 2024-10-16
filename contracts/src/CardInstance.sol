pragma solidity ^0.8;

import "./CardFactory.sol";
import "./Main.sol";

contract CardInstance {
    /** Décrit un modèle de carte */
    struct Card {
        string nom;
        uint id;
        string imageUrl; /** On stocke juste un id, l'URL sera "calculé" */
    }
    Card cardType;
    uint globalId;


    modifier onlyOwnerOf(uint _cardId) {
        require(msg.sender == cardToOwner[_cardId]);
        _;
    }

    constructor(Card memory _cardType, uint _globalId) {
        cardType = _cardType;
        globalId = _globalId;
    }
}

