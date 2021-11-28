const {
  Client,
  Intents
} = require('discord.js');
const {
  token,
  prefix
} = require('./config.json');

const playerPattern = {
  type: "",
  skillList: [{
      order: 1,
      name: "",
      toy: ""
    },
    {
      order: 2,
      name: "",
      toy: ""
    },
    {
      order: 3,
      name: "",
      toy: ""
    },
    {
      order: 4,
      name: "",
      toy: ""
    }
  ],
  pet: ""
};

const patternSetup = {
  name: "",
  zone: {
    name: "",
    num: ""
  },
  playerList: []
};

patternSetup.playerList.push(playerPattern);
patternSetup.playerList.push(playerPattern);
patternSetup.playerList.push(playerPattern);
patternSetup.playerList.push(playerPattern);

var newSetup = {};
var numPlayer = 0;
var orderSkill = 0;
var isOnGoing = 0;

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
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'clear') {
    newSetup = patternSetup;
    numPlayer = 0;
    orderSkill = 0;
    isOnGoing = false;
    message.channel.send('Reset DONE!');
  } else if (command === 'ping') {
    message.channel.send('pong');
  } else if (command === 'check') {
    message.channel.send("Current setup: " + JSON.stringify(newSetup));
  } else if (command === 'add') {
    isOnGoing = true;
    message.channel.send('Next Command : !boss nameBoss');
  } else if (isOnGoing == true) {
    if (command === 'boss') {
      newSetup.name = args[0];
      message.channel.send('Next Command : !zone nameZone numZone');
    } else if (command === 'zone') {
      newSetup.zone.name = args[0];
      newSetup.zone.num = args[1];
      message.channel.send('Next Command : !player numPlayer className');
    } else if (command === 'player') {
      numPlayer = parseInt(args[0]) - 1;
      newSetup.playerList[numPlayer].type = args[1];
      //affichage liste des sorts
      message.channel.send('Next Command : !pet namePet');
    } else if (command === 'pet') {
      newSetup.playerList[numPlayer].type = args[0];
      //affichage liste des sorts
      message.channel.send('Next Command : !skill orderSkill nameSkill nameToy');
    } else if (command === 'skill') {
      orderSkill = parseInt(args[0]) - 1;
      newSetup.playerList[numPlayer].skillList[orderSkill].name = args[1];
      newSetup.playerList[numPlayer].skillList[orderSkill].toy = args[2];
      if (isSkillListFilledUp(newSetup.playerList[numPlayer].skillList)) {
        if (isPlayerListFilledUp(newSetup.playerList)) {
          message.channel.send('Your setup is finshed!');
        } else {
          message.channel.send('Next Command : !player numPlayer className');
        }
      } else {
        message.channel.send('Next Command : !skill orderSkill nameSkill nameToy');
      }
    }
  }
})

function isSkillListFilledUp(skillList) {
  return skillList.every((skill) => {
    return (skill.name !== "");
  });
}

function isPlayerListFilledUp(playerList) {
  return playerList.every((player) => {
    return (isSkillListFilledUp(player.skillList));
  });
}

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