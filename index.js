import { Client, GatewayIntentBits, Events } from 'discord.js';
import {generateBuildMessage} from './src/generateBuildMessage.js'
import { config } from 'dotenv';

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (msg) => {
  const sendMessage = (message) => {
    client.channels.cache.get(msg.channel.id).send(message);
  };
  return generateBuildMessage(msg, sendMessage)
});

client.login(process.env.BOT_TOKEN);