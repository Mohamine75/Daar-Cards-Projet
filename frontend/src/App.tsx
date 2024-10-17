import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';
import 'bulma/css/bulma.min.css';
type Canceler = () => void;

const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>();
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncaught error', error));
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current();
        cancelerRef.current = undefined;
      }
    };
  }, dependencies);
};

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>();
  const [contract, setContract] = useState<main.Main>();
  const [cards, setCards] = useState<main.Card[]>([]); // State pour stocker les cartes

  useAffect(async () => {
    const details_ = await ethereum.connect('metamask');
    if (!details_) return;
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) return;
    setContract(contract_);

    // Récupérer les cartes de l'utilisateur après l'initialisation du contrat
    if (contract_) {
      const ownedCardIds = await contract_.callStatic.getCardsByOwner(details_.account);
      const fetchedCards = await Promise.all(
        ownedCardIds.map(async (cardId: number) => {
          const cardDetails = await contract_.getCardDetails(cardId); // Appel à getCardDetails
          return cardDetails;
        })
      );
      setCards(fetchedCards);
    }
  }, []);

  return useMemo(() => {
    if (!details || !contract) return;
    return { details, contract, cards }; // Inclure les cartes dans le retour
  }, [details, contract, cards]);
};

export const App = () => {
  const wallet = useWallet();

  return (
    <nav className="navbar has-shadow" role="navigation" aria-label="main navigation" style={{ borderBottom: '2px solid #ccc' }}>
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <img src="src/assets/logo_TCG.png" alt="Pokemon TCG Logo"
               style={{ width: '100px', height: '100px', objectFit: 'contain' }}  // Ajustement de l'image
          />
        </a>
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item">
            Home
          </a>
          <a className="navbar-item">
            Documentation
          </a>
          <a className="navbar-item">
            Collections
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a className="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardContainer}>
        {wallet?.cards.map((card, index) => (
          <div key={index} className={styles.card}>
            <img src={card.imageUrl} alt={card.nom} />
            <h3>{card.nom}</h3>
            <p>Prix: {card.prix} ETH</p>
            <p>{card.dispo ? 'Disponible' : 'Non disponible'}</p>
          </div>
        ))}
      </div>
    </nav>
  );
}
