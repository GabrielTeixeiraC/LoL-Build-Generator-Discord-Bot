import axios from "axios";
const apiUrl = 'https://ddragon.leagueoflegends.com';

async function getBaseUrls() {
  const latestVersion = await getLatestVersion();
  const baseImageUrl = `${apiUrl}/cdn/${latestVersion}/img/`;
  const baseUrl = `${apiUrl}/cdn/${latestVersion}/data/pt_BR/`;
  const baseRuneImageUrl = `${apiUrl}/cdn/img/`;
  return {
    baseImageUrl,
    baseUrl,
    baseRuneImageUrl
  }
}

async function getLatestVersion() {
  const { data } = await axios.get(`${apiUrl}/api/versions.json`);
  if(data.length === 0) throw new Error('No versions found')
  return data[0];
}

async function getChampion() {
  const { data } = await axios.get(`${apiUrl}/cdn/${await getLatestVersion()}/data/en_US/champion.json`);
  return data;
}

async function getChampionDetails(champion) {
  const { baseUrl } = await getBaseUrls();
  const { data } = await axios.get(baseUrl + 'champion/' + champion + '.json');
  return data;
}

async function getItems() {
  const { baseUrl } = await getBaseUrls();
  const { data } = await axios.get(baseUrl + 'item.json');
  return data;
}

async function getRunes() {
  const { baseUrl } = await getBaseUrls();
  const { data } = await axios.get(baseUrl + 'runesReforged.json');
  return data;
}

export {
  getLatestVersion,
  getChampion,
  getChampionDetails,
  getItems,
  getRunes,
  getBaseUrls,
}
