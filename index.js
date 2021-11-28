const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const token = 'OTE0MTg0MzM2OTAxODE2MzUx.YaJWgg.bvl8Mq3tl3ec5RzXWx-_cga_4H0';
const admin = require('firebase-admin');

const serviceAccount = require('./firebase.json');

client.once('ready', () => {
   console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});

client.login(token);

client.on("message", message => {
    if (message.content === "!ping") {
      message.channel.send("Pong.")
    }
  })