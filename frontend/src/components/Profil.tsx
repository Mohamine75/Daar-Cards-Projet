import React, { useEffect, useState } from 'react';
import * as main from '@/lib/main';

const Profil = ({ wallet }: { wallet: any }) => {
  console.log("coucou profil");

  const [ownedCardIds, setOwnedCardIds] = useState<number[]>([]);
  const [cards, setCards] = useState<Array<{ owner: string; price: number }>>([]); // Type explicite pour le tableau de cartes

  useEffect(() => {
    const fetchOwnedCards = async () => {
      if (!wallet) return;

      try {
        const cardIds = await main.getCardsByOwner(wallet.details, wallet.details.account);
        //console.log(cardIds);
        console.log("ok1");
        //setOwnedCardIds(cardIds);

       //const cardDetailsPromises = cardIds.map(id => main.getCardDetails(wallet.details, id));
        //const cardDetails = await Promise.all(cardDetailsPromises);
        console.log("ok2");

        // Filtrer les cartes null et assigner le type explicitement
        //const filteredCards = cardDetails.filter(card => card !== null) as Array<{ owner: string; price: number }>;
        //setCards(filteredCards);
        console.log("ok3");

      } catch (error) {
        console.error('Error fetching owned cards:', error);
      }
    };



    fetchOwnedCards();

    console.log("ok4");

  }, [wallet, ownedCardIds]);

  return (
    <div>
      <h2>Your Profils</h2>
      <h3>Owned Cards:</h3>
      <ul>
        {/*{cards.map((card, index) => (
          <li key={index}>
            <p>Owner: {card.owner}</p>
            <p>Price: {card.price} ETH</p>
            {/* Ajoutez d'autres informations de la carte ici }
          </li>
        ))}*/}
      </ul>
    </div>
  );
};

export default Profil;
