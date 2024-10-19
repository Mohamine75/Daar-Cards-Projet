import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bulma/css/bulma.min.css';
import { Layout } from '@/components/Layout'
import { Home } from '@/components/Home'


type Canceler = () => void;
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>();
  const [contract, setContract] = useState<main.Main>();
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask');
    console.log('Wallet details:', details_); // Debug log
    if (!details_) {
      console.log("Probleme details")
      return;
    }
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) {
      console.log('probleem contrat')
      return;
    }
    setContract(contract_);
  }, []);
  return useMemo(() => {
    if (!details || !contract) {
      console.log("probleme useMemo")
      return null;
    }// Modifie ceci pour retourner null
    console.log("Chargement réussi");
    return { details, contract };
  }, [details, contract]);
};
export const App = () => {
  const wallet = useWallet();
  console.log('Wallet in App:', wallet); // Debug log
  if (!wallet) {
    return <div>Loading wallet...</div>; // Ou retourner null
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Tes routes ici */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
