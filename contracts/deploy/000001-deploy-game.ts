import { DeployFunction } from 'hardhat-deploy/types';

const deployer: DeployFunction = async hre => {
  const CardInstance = await hre.ethers.getContractFactory("CardInstance");
  const cardInstance = await CardInstance.deploy();
  await cardInstance.deployed();

  const Main = await hre.ethers.getContractFactory("Main");

  const { deployer } = await hre.getNamedAccounts();

  const main = await Main.deploy(cardInstance.address);
  await main.deployed();
  console.log("Main deployed to:", main.address);


  console.log("CardInstance deployed to:", cardInstance.address);
}

export default deployer;
