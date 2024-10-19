import React, { useEffect, useState } from 'react';
import * as main from '@/lib/main';

const Profil = ({ wallet }: { wallet: any }) => {
  console.log("coucou profil")

  const [ownedCardIds, setOwnedCardIds] = useState<number[]>([]);
  const [cards, setCards] = useState<Array<{ owner: string; price: number }>>([]); // Type explicite pour le tableau de cartes

  useEffect(() => {
    const fetchOwnedCards = async () => {
      if (!wallet) return;

      try {
        const cardIds = await main.getCardsByOwner(wallet.details, wallet.details.account);
        setOwnedCardIds(cardIds);

        // Récupère les détails pour chaque carte
        const cardDetailsPromises = cardIds.map(id => main.getCardDetails(wallet.details, id));
        const cardDetails = await Promise.all(cardDetailsPromises);

        // Filtrer les cartes null et assigner le type explicitement
        const filteredCards = cardDetails.filter(card => card !== null) as Array<{ owner: string; price: number }>;
        setCards(filteredCards);
      } catch (error) {
        console.error('Error fetching owned cards:', error);
      }
    };

    fetchOwnedCards();
  }, [wallet]);
  return (
    <div>
      <h2>Your Profile</h2>
      <h3>Owned Cards:</h3>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>
            <p>Owner: {card.owner}</p>
            <p>Price: {card.price} ETH</p>
            {/* Ajoutez d'autres informations de la carte ici */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profil;
