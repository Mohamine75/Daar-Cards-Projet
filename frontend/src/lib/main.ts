import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import { contracts } from '@/contracts.json'
import Main from '@/abis/Main.json'


export const correctChain = () => {
  return 31337
}

const mainAddr = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

export const init = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }

  const contract = new ethers.Contract(mainAddr, Main, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any
}