pragma solidity ^0.8;

import "./Main.sol";

contract CardInstance {
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


}

