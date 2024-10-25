const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const MainAddr = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";  // Adresse de ton contrat principal
let main;

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
                "internalType": "uint32",
                "name": "prix",
                "type": "uint32"
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
            "internalType": "uint32",
            "name": "_newPrice",
            "type": "uint32"
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
            "internalType": "uint32",
            "name": "prix",
            "type": "uint32"
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
                "internalType": "uint32",
                "name": "prix",
                "type": "uint32"
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

    main = new web3.eth.Contract(abi_main, MainAddr);

  // Récupérer et afficher toutes les cartes
  await displayCardsByCollections();
}

async function displayCardsByCollections() {
  const collectionsContainer = $("#collections-container");
  collectionsContainer.empty();

  // Récupérer le nombre total de collections
  const totalCollections = await main.methods.getTotalCollection().call();  // Remplace par la méthode qui retourne le nombre total de collections

  // Boucle à travers chaque collection
  for (let collectionId = 0; collectionId < totalCollections; collectionId++) {
    const collectionName = await main.methods.getCollectionName(collectionId).call();
    const totalCardsInCollection = await main.methods.getCurrentCardCount(collectionId).call(); // méthode pour obtenir le nombre de cartes dans la collection

    // Créer un bloc pour chaque collection
    let collectionHtml = `
          <div class="box is-shadowless">
              <h2 class="title is-4">Collection ${collectionId}: ${collectionName}</h2>
              <div class="columns is-multiline" id="collection-${collectionId}">
                  <!-- Les cartes de cette collection seront affichées ici -->
              </div>
          </div>
      `;
    collectionsContainer.append(collectionHtml);
    let row = $(`#collection-${collectionId}`);

    // Afficher chaque carte de la collection
    for (let cardIndex = 0; cardIndex < totalCardsInCollection; cardIndex++) {
      const card = await main.methods.getCardInCollection(collectionId, cardIndex).call(); // méthode pour obtenir la carte par ID

      // Générer l'HTML pour chaque carte
      const cardHtml = `
              <div class="column is-one-quarter">
                  <div class="card"  style="background-image: url('https://images.pokemontcg.io/${collectionName}/logo.png'); background-position: top; background-repeat: no-repeat; padding-top: 40px; background-size: auto 40px; ">
                      <div class="card-image">
                          <figure class="image is-4by3">
                              <img src="${card.imageUrl}" alt="${card.nom}">
                          </figure>
                      </div>
                      <div class="card-content">
                          <p class="title is-5">${card.nom}</p>
                          <!-- <p>ID: ${card.id}</p> -->
                      </div>
                  </div>
              </div>
          `;
      row.append(cardHtml);
    }
  }
}

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(web3.currentProvider);
  } else {
    console.log("Please install Metamask");
  }

  startApp();
});
