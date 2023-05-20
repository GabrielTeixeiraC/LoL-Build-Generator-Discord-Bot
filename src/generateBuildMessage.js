import {getRandomBuild} from './getRandomBuild.js';

export async function generateBuildMessage (msg, sendMessage) {
  const message = msg.content
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  try {
    if (message === '!build') {
      await createBuildDefault(sendMessage);
      return;
    }
    if (message === '!build mini') {
      await createBuildMini(sendMessage);
      return;
    }
    if (message.match('!build')) {
      returnHelpMessage(sendMessage);
      return;
    }
  } catch (err) {
    console.error(err);
    sendMessage('Erro ao gerar build, tente novamente mais tarde.');
  }
}

async function createBuildDefault (sendMessage) {
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

async function createBuildMini (sendMessage) {
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

function returnHelpMessage (sendMessage) {
  let helpMessage = '**COMANDOS:** \n';
  helpMessage += '!build - Gera build aleatória com imagens \n';
  helpMessage += '!build mini - Gera build aleatória em texto apenas (mais rápido) \n';

  sendMessage(helpMessage);
}