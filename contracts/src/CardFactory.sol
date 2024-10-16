
pragma solidity ^0.8;

contract CardFactory {
    struct Card {
        string nom;
        uint id;
        string imageUrl; /** On stocke juste un id, l'URL sera "calculé" */
    }
    /** TODO : faire une fonction d'échange avec événement */
    /** TODO : faire une fonction d'achat avec événement | Ajouter un fee de transfert, pour récupérer de l'argent sur les ventes de cartes hehe
                => Ne pas oublier le modifier onlyOwner pour les fonctions de modification de frais de transfert et de withdraw
     */
}