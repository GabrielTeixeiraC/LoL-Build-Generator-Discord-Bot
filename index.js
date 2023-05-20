const { Client, GatewayIntentBits, Events } = require('discord.js');
const { getRandomBuild } = require('./getRandomBuild.js');

const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (msg) => {
  let message = msg.content;

  let botChannel = msg.channel.id;

  const sendMessage = (message) => {
    client.channels.cache.get(botChannel).send(message);
  };

  message = message.toLowerCase();
  message = message.replace(/\s+/g, ' ');
  message = message.trim();

  if (message === '!build') {
    const build = (await getRandomBuild()).images;
    sendMessage(build.championImage);

    let spellsString = '**Habilidades:** ';
    for (let i = 0; i < 3; i++) {
      spellsString += build.spellsPriorityHotkeys[i] + ' ';
    }

    sendMessage(spellsString);
    for (let i = 0; i < 3; i++) {
      sendMessage(build.spellImages[i]);
    }

    sendMessage('**Runas primárias:** ');
    for (let i = 0; i < 4; i++) {
      sendMessage(build.runes[i]);
    }

    sendMessage('**Runas Secundárias:** ');
    for (let i = 4; i < 6; i++) {
      sendMessage(build.runes[i]);
    }

    sendMessage('**Itens:** ');
    for (let i = 0; i < 6; i++) {
      sendMessage(build.items[i]);
    }
  }
  else if (message === '!build mini') {
    const build = (await getRandomBuild()).names;

    let buildString = '**' + build.champion + '**' + '\n';

    buildString += '**Habilidades:** ';
    for (let i = 0; i < 3; i++) {
      buildString += build.spellsPriorityHotkeys[i] + ' ';
    }
    buildString += '\n';

    buildString += '**Runas primárias:** \n';
    buildString += '\t' + '**' + build.runesTypes[0] + '**' + '\n';
    for (let i = 0; i < 4; i++) {
      buildString += '\t\t' + build.runes[i] + '\n';
    }

    buildString += '**Runas Secundárias:** \n';
    buildString += '\t' + '**' + build.runesTypes[1] + '**' + '\n';
    for (let i = 4; i < 6; i++) {
      buildString += '\t\t' + build.runes[i] + '\n';
    }

    buildString += '**Itens:** \n';
    for (let i = 0; i < 6; i++) {
      buildString += '\t' + build.items[i] + '\n';
    }

    sendMessage(buildString);
  }
  else if (message === '!build help') {
    let helpMessage = '**COMANDOS:** \n';
    helpMessage += '!build - Gera build aleatória com imagens \n';
    helpMessage += '!build mini - Gera build aleatória em texto apenas (mais rápido) \n';

    sendMessage(helpMessage);
  }

});

client.login(process.env.BOT_TOKEN);