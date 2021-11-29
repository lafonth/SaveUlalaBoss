const fs = require('fs');
const {
  Client,
  Intents
} = require('discord.js');
const {
  token,
  prefix
} = require('./config.json');

let json = require('./data/storage.json');

try {

  var nextPosition = json.length;

  var patternSetup = {
    name: "",
    zone: {
      name: "",
      num: ""
    },
    playerList: [{
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
      },
      {
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
      },
      {
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
      },
      {
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
      }
    ]
  };

  json[nextPosition] = patternSetup;
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
      reset();
      message.channel.send('Reset DONE!');
    } else if (command === 'save') {
      saveData(json);
      reset();
      message.channel.send('Setup saved!');
    } else if (command === 'check') {
      message.channel.send("Current setup: " + JSON.stringify(json[nextPosition]));
    } else if (command === 'add') {
      isOnGoing = true;
      message.channel.send('Next Command : !b nameBoss nameZone numZone');
    } else if (isOnGoing == true) {
      if (command === 'b') {
        json[nextPosition].name = args[0];
        json[nextPosition].zone.name = args[1];
        json[nextPosition].zone.num = args[2];
        message.channel.send('Next Command : !p numPlayer className petName skill1 skill2 skill3 skill4 toy1 toy2 toy3 toy4');
      } else if (command === 'p') {
        numPlayer = parseInt(args[0]) - 1;
        json[nextPosition].playerList[numPlayer].type = args[1];
        json[nextPosition].playerList[numPlayer].pet = args[2];
        for (let index = 0; index < 4; index++) {
          json[nextPosition].playerList[numPlayer].skillList[index].name = args[index+3];
        }
        for (let index = 0; index < 4; index++) {
          json[nextPosition].playerList[numPlayer].skillList[index].toy = args[index+7];
        }
        if (isSkillListFilledUp(json[nextPosition].playerList[numPlayer].skillList)) {
          if (isPlayerListFilledUp(json[nextPosition].playerList)) {
            message.channel.send('Your setup is finshed!');
            saveData(json);
          } else {
            message.channel.send('Next Command : !p numPlayer className petName skill1 skill2 skill3 skill4 toy1 toy2 toy3 toy4');
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

  function reset() {
    json[nextPosition] = patternSetup;
    numPlayer = 0;
    orderSkill = 0;
    isOnGoing = false;
  }

  function saveData(setup) {
    // convert JSON object to string
    const data = JSON.stringify(setup);

    // write JSON string to a file
    fs.writeFile('data/storage.json', data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
  }

} catch (error) {
  saveData(json);
  console.log(error);
}