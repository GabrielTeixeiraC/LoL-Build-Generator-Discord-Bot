const axios = require('axios');

let baseUrl = '';
let baseImageUrl = '';
const baseRuneImageUrl = 'https://ddragon.leagueoflegends.com/cdn/img/';
const versionsUrl = 'https://ddragon.leagueoflegends.com/api/versions.json';

const spellsDictionary = {
  '0': 'Q',
  '1': 'W',
  '2': 'E',
}

const trickyItemsIDs = [
  '1001', // Boots
  '3026', // Guardian Angel
  '4403', // The Golden Spatula
];

async function getLatestVersion() {
  const { data } = await axios.get(versionsUrl);
  return data[0];
}

async function getRandomChampion() {
  const { data } = await axios.get(baseUrl + 'champion.json');
  const champions = Object.keys(data.data);
  const randomChampion = champions[Math.floor(Math.random() * champions.length)];
  return randomChampion;
}

function getChampionImage(champion) {
  const championImage = baseImageUrl + 'champion/' + champion + '.png';

  return championImage;
}

// Returns a random permutation of the array [0, 1, 2]
function getRandomSpellPriority() {
  let spellList = ['0', '1', '2'];
  const spellPriority = [];

  const firstPriority = spellList[Math.floor(Math.random() * spellList.length)];
  spellList.splice(spellList.indexOf(firstPriority), 1);
  spellPriority.push(firstPriority);

  const secondPriority = spellList[Math.floor(Math.random() * spellList.length)];
  spellList.splice(spellList.indexOf(secondPriority), 1);

  spellPriority.push(secondPriority);
  spellPriority.push(spellList[0]);

  return spellPriority;
}

function getSpellImage(championData, spell) {
  const spellImage = baseImageUrl + 'spell/' + championData.spells[spell].image.full;
  return spellImage
}

async function getAllSpellsImagesAndPriority(champion) {
  const { data } = await axios.get(baseUrl + 'champion/' + champion + '.json');
  const championData = data.data[champion];
  
  const spellPriority = getRandomSpellPriority();
  
  const spellsPriorityHotkeys = [];
  const spellImages = [];
  for (let i = 0; i < 3; i++) {
    spellsPriorityHotkeys.push(spellsDictionary[spellPriority[i]]);
    spellImages.push(getSpellImage(championData, spellPriority[i]));
  }
  
  return { spellImages, spellsPriorityHotkeys };
}

async function getRandomRuneTypes() {
  const { data } = await axios.get(baseUrl + 'runesReforged.json');
  const runes = data;
  const types = [];

  while (types.length < 2) {
    const randomType = runes[Math.floor(Math.random() * runes.length)];
    if (!types.includes(randomType)) {
      types.push(randomType);
    }
  }

  return types;
}

async function getRandomRunes() {
  const runesNames = [];
  const runesImages = [];
  const runeTypes = await getRandomRuneTypes();

  // Randomly select 2 numbers from 1 to 3 to get 2 non-keystone rune slots from the second rune tree
  // Example: [1, 2] means that the 2nd and 3rd slots from the second rune tree will be selected
  const randomSlots = [];
  while (randomSlots.length < 2) {
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    if (!randomSlots.includes(randomNumber)) {
      randomSlots.push(randomNumber);
    }
  }

  for (let i = 0; i < 6; i++) {
    const rune = runeTypes[i < 4 ? 0 : 1].slots[i < 4 ? i : randomSlots[i - 4]].runes[Math.floor(Math.random() * 4)];
    runesNames.push(rune.name);
    runesImages.push(baseRuneImageUrl + rune.icon);
  }

  // Get only the names of the rune trees
  for (let i = 0; i < 2; i++) {
    runeTypes[i] = runeTypes[i].name;
  }

  return {
    runeTypes,
    runesImages,
    runesNames
  };
}

function getBoots(items) {
  const boots = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].tags.includes('Boots')) {
      boots.push(items[i]);
    }
  }

  return boots;
}

function getMythicsAndRemove(items) {
  const mythicItems = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].description.includes('Mythic')) {
      mythicItems.push(items[i]);
      items.splice(i, 1);
      i--;
    }
  }

  return [items, mythicItems];
}

async function getRandomItems() {
  const { data } = await axios.get(baseUrl + 'item.json');
  let itemsObject = data.data;

  const baseItemURL = baseImageUrl + 'item/';
  
  // Remove tricky items and items that are not in the store
  const filtered = Object.entries(itemsObject).filter(([id, value]) => !trickyItemsIDs.includes(id));
  itemsObject = Object.fromEntries(filtered);
  itemsObject = Object.values(itemsObject);

  itemsObject = itemsObject.filter(item => item.inStore != false);

  const items = { names: [], images: [] };

  // Get random boots
  const boots = getBoots(itemsObject);
  const randomBoot = boots[Math.floor(Math.random() * boots.length)];
  items.names.push(randomBoot.name);
  items.images.push(baseItemURL + randomBoot.image.full);

  // Get random mythic item
  const [itemsWithoutMythics, mythicItems] = getMythicsAndRemove(itemsObject);
  itemsObject = itemsWithoutMythics;
  const randomMythic = mythicItems[Math.floor(Math.random() * mythicItems.length)];
  items.names.push(randomMythic.name);
  items.images.push(baseItemURL + randomMythic.image.full);

  // Get random legendary items
  while (items.names.length < 6) {
    const filteredItems = itemsObject.filter(item => item.depth > 2);
    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];

    if (!items.names.includes(itemName)) {
      items.names.push(randomItem.name);
      items.images.push(baseItemURL + randomItem.image.full);
    }
  }

  return items;
}

async function getRandomBuild() {
  const latestVersion = await getLatestVersion();

  baseUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/pt_BR/`;
  baseImageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/`;

  const champion = await getRandomChampion();
  const championImage = getChampionImage(champion);

  const { spellImages, spellsPriorityHotkeys } = await getAllSpellsImagesAndPriority(champion);

  const runes = await getRandomRunes();
  const items = await getRandomItems();

  const build = {
    names: {
      champion,
      spellsPriorityHotkeys,
      runesTypes: runes.runeTypes,
      runes: runes.runesNames,
      items: items.names
    },
    images: {
      championImage,
      spellsPriorityHotkeys,
      spellImages,
      runes: runes.runesImages,
      items: items.images
    }
  }

  return build;
}

module.exports = {
  getRandomBuild
}