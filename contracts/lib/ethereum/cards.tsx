// @ts-ignore
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("Please install MetaMask!");
        return;
      } else {
        console.log("Ethereum object found:", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setAccount(accounts[0]);
        const _provider = new ethers.providers.Web3Provider(ethereum);
        setProvider(_provider);
      } else {
        console.log("No accounts found!");
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window as any;

    if (!ethereum) {
      console.log("Please install MetaMask!");
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    const _provider = new ethers.providers.Web3Provider(ethereum);
    setProvider(_provider);
  };

  const sendTransaction = async () => {
    if (!provider) return;

    const signer = provider.getSigner();
    const tx = {
      to: "0xRecipientAddressHere", // Remplace par l'adresse de destination
      value: ethers.utils.parseEther("0.01"), // Montant à envoyer en Ether
    };

    try {
      const transactionResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent:", transactionResponse);
      await transactionResponse.wait(); // Attendre la confirmation
      console.log("Transaction confirmed!");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };
};

export default Home;
