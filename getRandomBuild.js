const axios = require('axios');

let baseUrl = '';
let baseImageUrl = '';
let baseRuneImageUrl = '';

const spellsDictionary = {
  '0': 'Q',
  '1': 'W',
  '2': 'E',
}

const trickyItemsIDs = [
  '3026', // Guardian Angel
  '4403', // The Golden Spatula
];

async function getLatestVersion() {
  const { data } = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
  return data[0];
}

async function getRandomChampion() {
  const { data } = await axios.get(baseUrl + 'champion.json');
  const champions = Object.keys(data.data);
  const randomChampion = champions[Math.floor(Math.random() * champions.length)];
  return randomChampion;
}

async function getChampionImage(champion) {
  const championImage = baseImageUrl + 'champion/' + champion + '.png';

  return championImage;
}

async function getRandomSpellPriority() {
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



async function getSpellImage(championData, spell) {
  const spellImage = baseImageUrl + 'spell/' + championData.spells[spell].image.full;
  return spellImage
}

async function getAllSpellsImagesAndPriority(champion) {
  const spellImages = [];
  const { data } = await axios.get(baseUrl + 'champion/' + champion + '.json');
  const championData = data.data[champion];

  const spellPriority = await getRandomSpellPriority();

  const spellsPriorityHotkeys = [];
  spellsPriorityHotkeys.push(spellsDictionary[spellPriority[0]]);
  spellsPriorityHotkeys.push(spellsDictionary[spellPriority[1]]);
  spellsPriorityHotkeys.push(spellsDictionary[spellPriority[2]]);

  spellImages.push(await getSpellImage(championData, spellPriority[0]));
  spellImages.push(await getSpellImage(championData, spellPriority[1]));
  spellImages.push(await getSpellImage(championData, spellPriority[2]));

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

  const randomSlots = [];
  while (randomSlots.length < 2) {
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    if (!randomSlots.includes(randomNumber)) {
      randomSlots.push(randomNumber);
    }
  }

  for (let i = 0; i < 4; i++) {
    const runesObject = runeTypes[0].slots[i].runes;
    const randomRune = runesObject[Math.floor(Math.random() * runesObject.length)];
    runesNames.push(randomRune.name);
    const runeImage = baseRuneImageUrl + randomRune.icon;
    runesImages.push(runeImage);
  }

  for (let i = 0; i < 2; i++) {
    const runesObject = runeTypes[1].slots[randomSlots[i]].runes;
    const randomRune = runesObject[Math.floor(Math.random() * runesObject.length)];
    runesNames.push(randomRune.name);
    const runeImage = baseRuneImageUrl + randomRune.icon;
    runesImages.push(runeImage);
  }

  for (let i = 0; i < 2; i++) {
    runeTypes[i] = runeTypes[i].name;
  }

  return {
    runeTypes,
    runesImages,
    runesNames
  };
}

async function getBoots(items) {
  const boots = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].tags.includes('Boots') && items[i].colloq != ';boot') {
      boots.push(items[i]);
    }
  }
  return boots;
}

async function removeAndReturnMythics(items) {
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

function filterItems(items) {
  items = items.filter(item => item.inStore != false && !trickyItemsIDs.includes(item.id));
  return items;
}

async function getRandomItems() {
  const { data } = await axios.get(baseUrl + 'item.json');
  let itemsObject = Object.values(data.data);
  itemsObject = filterItems(itemsObject);


  itemsObject = itemsObject.filter(item => item.inStore != false);

  const items = { names: [], images: [] };

  const boots = await getBoots(itemsObject);
  const randomBoot = boots[Math.floor(Math.random() * boots.length)];
  const bootName = randomBoot.name;
  const bootImage = baseImageUrl + 'item/' + randomBoot.image.full;
  items.names.push(bootName);
  items.images.push(bootImage);

  const [itemsWithoutMythics, mythicItems] = await removeAndReturnMythics(itemsObject);
  itemsObject = itemsWithoutMythics;
  const randomMythic = mythicItems[Math.floor(Math.random() * mythicItems.length)];
  const mythicName = randomMythic.name;
  const mythicImage = baseImageUrl + 'item/' + randomMythic.image.full;
  items.names.push(mythicName);
  items.images.push(mythicImage);

  while (items.names.length < 6) {
    const filteredItems = itemsObject.filter(item => item.depth > 2);
    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
    const itemName = randomItem.name;
    const itemImage = baseImageUrl + 'item/' + randomItem.image.full;
    if (!items.names.includes(itemName)) {
      items.names.push(itemName);
      items.images.push(itemImage);
    }
  }
  return items;
}

async function getRandomBuild() {
  const latestVersion = await getLatestVersion();

  baseUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/pt_BR/`;
  baseImageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/`;
  baseRuneImageUrl = 'https://ddragon.leagueoflegends.com/cdn/img/'

  const champion = await getRandomChampion();
  const championImage = await getChampionImage(champion);

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