const axios = require('axios');


let baseUrl = '';
let baseImageUrl = '';
let baseRuneImageUrl = '';

const spellsDictionary = {
    '0': 'Q',
    '1': 'W',
    '2': 'E',
}

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

    return [spellsPriorityHotkeys, spellImages];
}

async function getRandomRuneTypes() {
    const { data } = await axios.get(baseUrl + 'runesReforged.json');
    const runes = data;
    const types = [];

    for (let i = 0; i < 2; i++) {
        const randomType = runes[Math.floor(Math.random() * runes.length)];
        types.push(randomType);
    }

    return types;
}

async function getRandomRunesImages() {
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
        const runes = runeTypes[0].slots[i].runes;
        const randomRune = runes[Math.floor(Math.random() * runes.length)];
        const runeImage = baseRuneImageUrl + randomRune.icon;
        runesImages.push(runeImage);
    }

    for (let i = 0; i < 2; i++) {
        const runes = runeTypes[1].slots[randomSlots[i]].runes;
        const randomRune = runes[Math.floor(Math.random() * runes.length)];
        const runeImage = baseRuneImageUrl + randomRune.icon;
        runesImages.push(runeImage);
    }

    return runesImages;    
}

async function getBootsIDs(items) {
    const boots = [];

    for (let i = 0; i < items.length; i++) {
        if (items[i].tags.includes('Boots') && items[i].name != 'Boots') {
            boots.push(items[i].image.full);
        }
    }

    return boots;
}

async function removeMythicsFromItemsAndReturnIDs(items) {
    const mythicItems = [];

    for (let i = 0; i < items.length; i++) {
        if (items[i].description.includes('Mythic')) {
            mythicItems.push(items[i].image.full);
            items.splice(i, 1);
            i--;
        }
    }

    return [items, mythicItems];
}

async function getRandomItemsImages() {
    const { data } = await axios.get(baseUrl + 'item.json');
    let items = Object.values(data.data);
    items = items.filter(item => item.inStore != false);

    const itemsImages = [];

    const boots = await getBootsIDs(items);
    const randomBoot = boots[Math.floor(Math.random() * boots.length)];
    const bootImage = baseImageUrl + 'item/' + randomBoot;
    itemsImages.push(bootImage);

    const [itemsWithoutMythics, mythicItems] = await removeMythicsFromItemsAndReturnIDs(items);
    items = itemsWithoutMythics;
    const randomMythic = mythicItems[Math.floor(Math.random() * mythicItems.length)];
    const mythicImage = baseImageUrl + 'item/' + randomMythic;
    itemsImages.push(mythicImage);

    while (itemsImages.length < 6) {
        const filteredItems = items.filter(item => item.depth > 2);
        const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
        const itemImage = baseImageUrl + 'item/' + randomItem.image.full;
        if (!itemsImages.includes(itemImage)) {
            itemsImages.push(itemImage);
        }
    }

    return itemsImages;
}

async function getRandomBuild() {
    const latestVersion = await getLatestVersion();
    
    baseUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/`;
    baseImageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/`;
    baseRuneImageUrl = 'https://ddragon.leagueoflegends.com/cdn/img/'

    const champion = await getRandomChampion();
    const championImage = await getChampionImage(champion);

    const [spellsPriorityHotkeys, spellImages] = await getAllSpellsImagesAndPriority(champion);

    const runes = await getRandomRunesImages();

    const items = await getRandomItemsImages();

    const build = {
        championImage,
        spellsPriorityHotkeys,
        spellImages,
        runes,
        items
    }

    return build;
}

module.exports = {
    getRandomBuild
}