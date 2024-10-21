import 'dotenv/config';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-abi-exporter';
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    }
  },
  solidity: '0.8.20',
  paths: {
    deploy: './deploy',
    sources: './src',
  }
}
export default config;