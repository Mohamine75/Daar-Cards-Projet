import { DeployFunction } from 'hardhat-deploy/types';

const deployer: DeployFunction = async hre => {
  const CardInstance = await hre.ethers.getContractFactory("CardInstance");
  const cardInstance = await CardInstance.deploy();
  await cardInstance.deployed();

  const Main = await hre.ethers.getContractFactory("Main");

  const { deployer } = await hre.getNamedAccounts();

  // Déployer Main
  const main = await Main.deploy(deployer);
  await main.deployed();
  console.log("Main deployed to:", main.address);

  const globalId = 1; // ID global pour l'exemple

  // Déployer CardInstance

  console.log("CardInstance deployed to:", cardInstance.address);
}

export default deployer;
