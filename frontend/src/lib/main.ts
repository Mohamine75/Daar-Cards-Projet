import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import Main from '@/abis/Main.json'

export const correctChain = () => {
  return 31337; // ID de la chaîne HardHat
}

// Adresse du contrat Main (à mettre à jour dynamiquement après déploiement)
export const mainAddr = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details;
  const network = await provider.getNetwork();

  // Vérifier la chaîne
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat');
    return null;
  }

  // Initialiser le contrat Main
  const contract = new ethers.Contract(mainAddr, Main, provider);

  // Vérifier si le contrat est déployé
  try {
    const deployed = await contract.deployed();
    if (!deployed) return null;
  } catch (error) {
    console.error('Contract not deployed:', error);
    return null;
  }

  // Connecter le signer si disponible
  const contract_ = signer ? contract.connect(signer) : contract;
  return contract_ as any;
}

export const getCardsByOwner = async (details: ethereum.Details, ownerAddress: string): Promise<number[]> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return [];
  }

  try {
    return await contract.getCardsByOwner(ownerAddress);
  } catch (error) {
    console.error('Error fetching cards by owner:', error);
    return [];
  }
}

export const getCardDetails = async (details: ethereum.Details, cardId: number): Promise<{ owner: string, price: number } | null> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return null;
  }

  try {
    const result = await contract.getCardDetails(cardId);
    return {
      owner: result[0],
      price: result[1].toNumber() // Assurez-vous de convertir en nombre si nécessaire
    };
  } catch (error) {
    console.error('Error fetching card details:', error);
    return null;
  }
};


export const listenToDebugEvent = async (
  details: ethereum.Details,callback: (message: string) => void // Ajoutez ce paramètre
) => {
  const contract = await init(details);
  try {
    // Écouter l'événement Debug
    contract.events.Debug({ fromBlock: 'latest' })
      .on('data', (event: { returnValues: { message: any; }; }) => {
        console.log("Debug Event Received:", event.returnValues.message); // Affiche le message du debug
        callback(event.returnValues.message); // Appelez le callback avec le message
      })
      .on('error', (error: any) => {
        console.error('Error listening to Debug event:', error);
      });
  } catch (error) {
    console.error('Error setting up Debug event listener:', error);
  }
};