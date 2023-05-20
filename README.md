# Random League of Legends Build Generator

This is a Discord bot that generates a random League of Legends build, including a champion, spells, runes, and items. The bot uses the Discord.js library and interacts with the Riot Games API to retrieve game data.

*Please note that this is just a side project I've created to play with my friends. It doesn't cover all of the many edge cases in League of Legends and can be improved in various ways. Feel free to fork and submit a PR if you want to contribute. I appreciate any suggestions, feedback, and contributions.*

## Prerequisites

Before running the bot, make sure you have the following prerequisites:

- Node.js installed on your machine
- A Discord server with the bot added to it (You can follow the steps in the [Discord.js Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot))
- A Discord bot token (You can create a bot and obtain the token from the [Discord Developer Portal](https://discord.com/developers/applications))


## Installation

1. Clone the repository.
2. Open a terminal and navigate to the project directory.
3. Run the following command to install the dependencies:

   ```shell
   npm install
   ```

4. Rename the `.env.example` file to `.env` and replace `BOT_TOKEN` with your Discord bot token.
5. Save the changes.

## Usage

1. Start the bot by running the following command:

   ```shell
   node index.js
   ```

2. The bot should now be online and ready to respond to commands in the Discord server.
3. In your Discord server, you can use the following commands:

   - `!build` - Generates a random build and sends the details with images to the channel. The build includes a champion, spells, runes, and items.
   - `!build mini` - Generates a random build and sends a simplified text-based version to the channel. The build includes a champion, spells, runes, and items.
   - `!build help` - Displays the available commands and their descriptions.

## Customization

- If you want to modify the behavior of the build generation or add more features, you can edit the `getRandomBuild` function in the code.
- You can also customize the Discord message formatting and the bot's response by modifying the relevant parts in the `Events.MessageCreate` event handler.

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to use, modify, and distribute the code according to the terms of the license.

## Acknowledgments

- This project utilizes the [Discord.js](https://discord.js.org/) library for Discord bot interaction.
- It also relies on the [Riot Games API](https://developer.riotgames.com/) to retrieve League of Legends data.

That's it! You now have a Discord bot that generates random League of Legends builds. You can further enhance and customize the bot based on your requirements.

