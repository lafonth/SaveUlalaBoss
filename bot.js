const {
  Client,
  Intents
} = require('discord.js');
const {
  token,
  prefix
} = require('./config.json');

const myIntents = new Intents();

myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

const client = new Client({
  intents: myIntents
});

client.login(token);

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === 'ping'){
    message.channel.send('pong');
  }
})

// client.on('interactionCreate', async interaction => {
// 	if (!interaction.isCommand()) return;

// 	const { commandName } = interaction;

// 	if (commandName === 'ping') {
// 		await interaction.reply('Pong!');
// 	} else if (commandName === 'server') {
// 		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
// 	} else if (commandName === 'user') {
// 		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
// 	}
// });