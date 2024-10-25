const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const MainAddr = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Adresse du contrat principal
let main;
let userAccount;
async function startApp() {
  const abi_main =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_cardInstanceAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "Debug",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_imageUrlId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "_collectionId",
          "type": "uint16"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "cardId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "prix",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "dispo",
          "type": "bool"
        }
      ],
      "name": "NewCard",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "OwnableSetter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_globalCardId",
          "type": "uint256"
        }
      ],
      "name": "assignCard",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cardId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "buyCard",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "cards",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "nom",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "prix",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "dispo",
              "type": "bool"
            }
          ],
          "internalType": "struct CardInstance.Card",
          "name": "cardType",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "globalId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cardId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "dispo",
          "type": "bool"
        }
      ],
      "name": "changeDispo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cardId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_newPrice",
          "type": "uint256"
        }
      ],
      "name": "changePrix",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_imageUrl",
          "type": "string"
        },
        {
          "internalType": "uint16",
          "name": "_collectionId",
          "type": "uint16"
        }
      ],
      "name": "createCard",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "cardCount",
          "type": "uint256"
        }
      ],
      "name": "createCollection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllCardIdsFromCollections",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cardId",
          "type": "uint256"
        }
      ],
      "name": "getCardDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "nom",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "imageUrl",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "prix",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "dispo",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collectionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_cardIndex",
          "type": "uint256"
        }
      ],
      "name": "getCardInCollection",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "nom",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "prix",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "dispo",
              "type": "bool"
            }
          ],
          "internalType": "struct CardInstance.Card",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getCardsByOwner",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCollectionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cardId",
          "type": "uint256"
        }
      ],
      "name": "getCollectionIdFromCardId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collectionId",
          "type": "uint256"
        }
      ],
      "name": "getCollectionName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCountCards",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_collectionId",
          "type": "uint256"
        }
      ],
      "name": "getCurrentCardCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwners",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getRealId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalCollection",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_collectionId",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "_amountOfCards",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "openBooster",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "openBoosterFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_fee",
          "type": "uint256"
        }
      ],
      "name": "setOpeningBoosterFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  // Remplace par l'ABI du contrat principal
  main = new web3.eth.Contract(abi_main, MainAddr);
  ethereum.on('accountsChanged', async function(accounts) {
    // Vérifier si un compte est sélectionné
    if (accounts.length > 0) {
      userAccount = accounts[0]; // Met à jour le compte utilisateur
      await getCardsByOwner(userAccount).then(displayCards); // Recharger les cartes du nouveau compte
    } else {
      console.error("Aucun compte disponible après changement.");
    }
  });
  // Récupérer et afficher les cartes disponibles à l'achat
  await displayAvailableCards();
}

async function displayAvailableCards() {
  const marketplaceContainer = $("#marketplace-container");
  marketplaceContainer.empty();

  // Récupérer toutes les cartes
  const totalCards = await main.methods.getCountCards().call();  // Méthode pour obtenir le nombre total de cartes
  const cardPromises = [];

  for (let cardId = 0; cardId < totalCards; cardId++) {
    cardPromises.push(main.methods.cards(cardId).call());  // Récupérer chaque carte par son ID
  }

  const cards = await Promise.all(cardPromises);
  console.log(cards);
  // Parcourir les cartes pour afficher uniquement celles disponibles à l'achat
  let index = 0;
  for (const card of cards) {
    console.log("oui");

    if (card.cardType.dispo === true) {
      console.log(index);
      const cardHtml = `
        <div class="column is-one-quarter">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="${card.cardType.imageUrl}" alt="${card.cardType.nom}">
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-5">${card.cardType.nom}</p>
              <p>ID: ${card.cardType.id}</p>
              <p>Price: ${card.cardType.prix} ETH</p>
              <button class="button is-primary" onclick="buyCard(${index}, ${card.cardType.prix})">Buy Now</button>
            </div>
          </div>
        </div>
      `;

      marketplaceContainer.append(cardHtml);
    }
    index++;
  }
}

// Fonction d'achat d'une carte
async function buyCard(cardId, priceInEther) {

  // Convertir le prix de ether à wei avant d'envoyer la transaction
  console.log(userAccount);
  console.log(priceInEther);

  // Envoyer la transaction pour acheter la carte avec le montant exact en wei
  await main.methods.buyCard(cardId,userAccount).send({ from: userAccount, value: priceInEther});
  console.log(cardId);
  console.log(main.methods.getCardsByOwner(userAccount));
  // Recharger la page après l'achat
  await displayAvailableCards();
}

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(web3.currentProvider);
  } else {
    console.log("Please install Metamask");
  }
  startApp();
});
