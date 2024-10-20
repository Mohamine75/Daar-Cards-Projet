import { DeployFunction } from 'hardhat-deploy/types';

const deployer: DeployFunction = async hre => {
  const Main = await hre.ethers.getContractFactory("Main");
  const CardInstance = await hre.ethers.getContractFactory("CardInstance");

  const { deployer } = await hre.getNamedAccounts();

  // Déployer Main
  const main = await Main.deploy(deployer);
  await main.deployed();
  console.log("Main deployed to:", main.address);

  // Définir les paramètres pour le contrat Card
  const cardType = {
    nom: "Example Card",
    id: 1,
    imageUrl: "https://example.com/image.png",
    prix: 100, // Assurez-vous que ce prix soit conforme à votre logique
    dispo: true
  };

  const globalId = 1; // ID global pour l'exemple

  // Déployer CardInstance
  const cardInstance = await CardInstance.deploy(cardType, globalId);
  await cardInstance.deployed();
  console.log("CardInstance deployed to:", cardInstance.address);
}

export default deployer;
