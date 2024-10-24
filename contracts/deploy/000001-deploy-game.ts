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

  let limit = 0;
  console.log("CardInstance deployed to:", cardInstance.address);
  let collections: string[] = [];
  await fetch("https://api.pokemontcg.io/v2/sets").then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
    .then(data => {
      for (let i = 0; i < data.count; i++) {collections.push(data.data[i].id);
        main.createCollection(data.data[i].id, data.data[i].total)
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  for (const [index, collection] of collections.entries()) {
    if(limit>10) break;
    limit++;
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/cards?q=set.id:' + collection);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("====================================== " + collection);
      console.log("====================================== " + data.count);

      // Create cards for each collection
      for (let i = 0; i < data.count; i++) { // TODO : remplacer par data.count
        console.log("Creating card: " + data.data[i].name + " in collection index: " + index);
        await main.createCard(data.data[i].name, data.data[i].images.small, index);
      }
    } catch (error) {
      console.error('Error fetching cards data:', error);
    }
  }

  // TODO : mettre des createCard/assign card ici : sur le owner (moi)
  main.openBooster(8, 4, "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
}
export default deployer;