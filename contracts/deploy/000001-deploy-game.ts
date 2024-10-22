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

  // Collection names and card counts come from Pokemon tcg
  let collections: [string, number][] = [];  // Array of tuples: [collectionID, cardCount]
  fetch("https://api.pokemontcg.io/v2/sets")
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
    for (let i = 0; i < data.count; i++) {
      collections.push(data.data[i].id, data.data[i].total);
    }
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });

  for (let i = 0; i < collections.length; i++) {
    main.createCollection(collections[i][0], collections[i][1]);
  }

  collections.forEach(function(collection, index) {
    fetch('https://api.pokemontcg.io/v2/cards?q=set.id:' + collection[0])
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      for (let i = 0; i < data.count; i++) {
        main.createCard(data.data[i].name, data.data[i].images.small, index);
      }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  });

  // TODO : mettre des createCard/assign card ici : sur le owner (moi)
  main.createCard("salameche","",0);
  main.createCard("tortank","",0);
  main.createCard("magneto","",0);
  main.createCard("Azul","",0);
  main.createCard("Florizarre","",0);
  main.openBooster(0, 4, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  console.log(main.getCardsByOwner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
}

export default deployer;
