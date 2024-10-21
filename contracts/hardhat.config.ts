import 'dotenv/config';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-abi-exporter';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  paths: {
    deploy: './deploy',
    sources: './src',
  },
  namedAccounts: {
    deployer: { default: 0 },
    admin: { default: 0 },
    second: { default: 1 },
    random: { default: 8 },
  },
  abiExporter: {
    runOnCompile: true,
    path: '../frontend/src/abis',
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  },
  typechain: {
    outDir: '../typechain',
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      gasPrice: 20000000000, // 20 Gwei (en wei)
      gas: 6000000, // Gas limit
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 30000000000, // 30 Gwei (en wei)
      gas: 7000000, // Gas limit
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 Gwei (en wei)
      gas: 6000000, // Gas limit
    },
  },
};

export default config;