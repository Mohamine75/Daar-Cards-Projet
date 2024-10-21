import { ethers } from 'ethers';
import * as ethereum from './ethereum';
import CardInstance from '@/abis/CardInstance.json'; // Assurez-vous que le chemin est correct

// Adresse du contrat CardInstance (déployée sur le réseau Ethereum)
export const cardInstanceAddr = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Fonction pour initialiser le contrat CardInstance
export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details;

  // Initialiser le contrat
  const contract = new ethers.Contract(cardInstanceAddr, CardInstance, provider);

  // Si un signer est disponible, connecter le contrat avec ce signer pour permettre des transactions
  return signer ? contract.connect(signer) : contract;
};

// Récupérer le propriétaire d'une carte par son ID
export const getCardOwner = async (details: ethereum.Details, cardId: number): Promise<string | null> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return null;
  }

  try {
    return await contract.getCardOwner(cardId);
  } catch (error) {
    console.error('Error fetching card owner:', error);
    return null;
  }
};

// Transférer la propriété d'une carte à un autre utilisateur
export const transferCard = async (details: ethereum.Details, to: string, cardId: number): Promise<boolean> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return false;
  }

  try {
    const tx = await contract.transfer(to, cardId);
    await tx.wait(); // Attendre que la transaction soit confirmée
    return true;
  } catch (error) {
    console.error('Error transferring card:', error);
    return false;
  }
};

// Approuver un transfert de carte
export const approveCardTransfer = async (details: ethereum.Details, to: string, cardId: number): Promise<boolean> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return false;
  }

  try {
    const tx = await contract.approve(to, cardId);
    await tx.wait(); // Attendre que la transaction soit confirmée
    return true;
  } catch (error) {
    console.error('Error approving card transfer:', error);
    return false;
  }
};

// Prendre possession d'une carte approuvée
export const takeOwnership = async (details: ethereum.Details, cardId: number): Promise<boolean> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return false;
  }

  try {
    const tx = await contract.takeOwnership(cardId);
    await tx.wait(); // Attendre que la transaction soit confirmée
    return true;
  } catch (error) {
    console.error('Error taking ownership of card:', error);
    return false;
  }
};

// Assigner une carte à un utilisateur
export const assignCard = async (details: ethereum.Details, to: string, cardId: number): Promise<boolean> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return false;
  }

  try {
    const tx = await contract.assign(to, cardId);
    await tx.wait(); // Attendre que la transaction soit confirmée
    return true;
  } catch (error) {
    console.error('Error assigning card:', error);
    return false;
  }
};

// Récupérer le nombre de cartes d'un propriétaire
export const getOwnerCardCount = async (details: ethereum.Details, owner: string): Promise<number | null> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return null;
  }

  try {
    return await contract.getOwnerCardCount(owner);
  } catch (error) {
    console.error('Error fetching owner card count:', error);
    return null;
  }
};

// Incrémenter le nombre de cartes d'un propriétaire
export const incrementOwnerCardCount = async (details: ethereum.Details, owner: string): Promise<boolean> => {
  const contract = await init(details);
  if (!contract) {
    console.error("Contract not initialized");
    return false;
  }

  try {
    const tx = await contract.incrementOwnerCardCount(owner);
    await tx.wait(); // Attendre que la transaction soit confirmée
    return true;
  } catch (error) {
    console.error('Error incrementing owner card count:', error);
    return false;
  }
};
