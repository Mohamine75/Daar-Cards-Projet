const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

var cards;
var userAccount;
const cardIds = new Map(); // globalId => index
const cardInfos = new Map(); // globalId => bloc HTML contenant les détails de la carte

async function startApp() {
  const abi_main = [
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
  const MainAddr = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  // Initialiser l'instance du contrat
  main = new web3.eth.Contract(abi_main, MainAddr);

  // Obtenir tous les comptes connectés
  const accounts = await web3.eth.getAccounts();

  // Vérifier si des comptes sont disponibles
  if (accounts.length === 0) {
    console.error("Aucun compte connecté. Veuillez vous connecter à un portefeuille.");
    return;
  }

  // Utiliser le premier compte comme compte utilisateur (ou vous pouvez avoir une logique pour choisir un autre compte)
  userAccount = accounts[0];
  
  // Afficher les cartes du propriétaire actuel
  // await getCardsByOwner(userAccount).then(displayCards);
  await getCardsByOwner(userAccount).then(async(ownerCards) => {
    await fillIds(ownerCards);
    await fillCardsInfo(cardIds);
    displayCards(cardIds);
    
  })
  registerCardCallbacks();

  displayCollectionCount();

  // Écouter les changements de compte
  ethereum.on('accountsChanged', async function(accounts) {
    // Vérifier si un compte est sélectionné
    if (accounts.length > 0) {
      userAccount = accounts[0]; // Met à jour le compte utilisateur
      // await getCardsByOwner(userAccount).then(displayCards); // Recharger les cartes du nouveau compte
      await getCardsByOwner(userAccount).then(async (ownerCards) => {
        await fillIds(ownerCards);
        await fillCardsInfo(cardIds);
        displayCards(cardIds);
      })
      registerCardCallbacks();
    } else {
      console.error("Aucun compte disponible après changement.");
    }
  });
}

function fillIds(cardIdsOwner) {
  // id = Id global de la carte | index = ordre d'affichage (à modifier à chaque fois qu'on fait display cards)
  cardIdsOwner.forEach((id, index) => {
    cardIds.set(id, index);
  });
}

async function fillCardsInfo(cards) {
  for (const [id, index] of cards.entries()) {
    const card = await getCardDetails(id).then(card => {
      cardInfos.set(id, {
        nom: card.nom,
        id: card.id,
        imageUrl: card.imageUrl,
        prix: parseInt(card.prix),
        dispo: card.dispo
      })
    })
  
  }
}

async function displayCollectionCount() {
  try {
    // Attendre que la promesse de l'appel au contrat soit résolue
    var tmp = await main.methods.getCollectionCount().call();

    // Afficher le résultat après que la promesse a été résolue
    console.log(tmp);
  } catch (error) {
    // Gérer les erreurs si l'appel échoue
    console.error("Erreur lors de l'appel à getCollectionCount :", error);
  }
}

function registerCardCallbacks() {
  Array.from(document.getElementsByClassName('card')).forEach((cardElement) => {
    cardElement.onclick = function() {
      var card = cardInfos.get(BigInt(cardElement.getAttribute('id')));

      console.log(cardIds);
      console.log("index enregistré = " + cardElement.getAttribute('data-index'));
      // TODO for search
      openModal(cardElement.getAttribute('data-index'), card.id, encodeURIComponent(card.nom), encodeURIComponent(card.imageUrl), card.prix, card.dispo);
    };
  });
}

function displayCards(ids) {
  $("#cards").empty(); // Vider le conteneur de cartes
  ids.forEach((index, id) => {
    card = cardInfos.get(id);
    $("#cards").append(`
      <div class="column is-one-third">
        <div class="card" style="height: 100%;" data-index="${index}" id="${id}">
          <div class="card-image" style="position: relative;">
            <figure class="image is-4by3">
              <img src="${card.imageUrl}" alt="${card.nom} card image" style="object-fit: contain; width: 100%; height: auto;">
            </figure>
            <div class="card-overlay" style="position: absolute; bottom: 0; background: rgba(0, 0, 0, 0.5); color: white; width: 100%; padding: 10px; text-align: center;">
              <p>Prix : ${card.prix}</p>
              <p>Disponibilité : ${card.dispo ? 'Disponible' : 'Indisponible'}</p>
            </div>
          </div>
        </div>
      </div>
      `)});
}


function getCardsByOwner(id) {
  return main.methods.getCardsByOwner(id).call()
}

function getCardDetails(id) {
  return main.methods.getCardDetails(id).call()
}

function openModal(index, id, name, imgUrl, price, dispo) {
  name = decodeURIComponent(name);
  imgUrl = decodeURIComponent(imgUrl);

  document.getElementById("modal-title").textContent = name;
  document.getElementById("modal-id").textContent = id;
  document.getElementById("modal-img").src = imgUrl;
  document.getElementById("modal-price").value = price;
  document.getElementById("modal-dispo").checked = dispo;

  // Stocke l'index d'affichage dans la modale
  document.getElementById("cardModal").setAttribute("data-index", index);

  document.getElementById("cardModal").classList.add("is-active");
}

async function saveChanges() {
  const modal = document.getElementById("cardModal");
  const cardIndex = modal.getAttribute("data-index"); // Récupère l'index de l'affichage
  const newPrice = document.getElementById("modal-price").value;
  const newDispo = document.getElementById("modal-dispo").checked;
  console.log(modal);
  console.log(cardIndex);
  console.log(newPrice);
  console.log(newDispo);

  web3.eth.getAccounts().then(async accounts => {
    try {
      const priceInBN = parseInt(newPrice);
      if (isNaN(priceInBN) || priceInBN < 0 ) {
        throw new Error("Price must be a valid uint32 value between 0 and 4294967295.");
      }

      // TODO: trigger nouvelle récupération de getCardsByOwner
      // Récupérer les IDs des cartes possédées par l'utilisateur
      const ownedCardIds = await main.methods.getCardsByOwner(userAccount).call();
      console.log("ownedCardsID :" + ownedCardIds)
      // Utiliser l'index d'affichage pour récupérer le bon ID de carte
      const cardId = ownedCardIds[cardIndex];
      console.log(cardId);

      // Envoie la transaction pour changer le prix
      await main.methods.changePrix(cardId, priceInBN).send({ from: userAccount });
      console.log("Price changed successfully");

      // Envoie la transaction pour changer la disponibilité
      await main.methods.changeDispo(cardId, newDispo).send({ from: userAccount });
      console.log("Availability changed successfully");

      closeModal(); // Ferme la modale après avoir initié les transactions
    } catch (error) {
      console.error("Error during transactions:", error);
    }
  }).catch(error => {
    console.error("Error getting user accounts:", error);
  });
  document.getElementById('search').value = null;
  startApp();
}

function closeModal() {
  document.getElementById("cardModal").classList.remove("is-active");
}


document.getElementById('search').addEventListener('input', function(event) {
  const research = event.target.value;
  if (research == '') {
    displayCards(cardIds);
  } else {
    var toShow = Array.from(cardIds);
    const cardIdsToShow = new Map();
    toShow = toShow.filter(([cardId, _]) => {
      return (cardInfos.get(cardId).nom.toLowerCase().includes(research.toLowerCase()));
    });
    for (let i = 0; i < toShow.length; i++) {
      const key = toShow[i][0];
      const value = toShow[i][1];
      cardIdsToShow.set(key, value);
    }
    displayCards(cardIdsToShow);
  }
  registerCardCallbacks();
});

window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(web3.currentProvider);
  } else {
    console.log("Please install metamask");
  }
  startApp();
});