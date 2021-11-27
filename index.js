const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = 'OTE0MTg0MzM2OTAxODE2MzUx.YaJWgg.nKcFYlCHoz93EoT2VmtAEDNKa_k';

client.once('ready', () => {
   console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});

client.login(token);

client.on("message", message => {
    if (message.content === "!ping") {
      message.channel.send("Pong.")
    }
  })