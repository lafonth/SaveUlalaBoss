const fs = require('fs');
const {
  Client,
  Intents
} = require('discord.js');
// const {
//   token,
//   prefix
// } = require('./config.json');

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
  var addIsRuning = 0;

  const myIntents = new Intents();

  myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

  const client = new Client({
    intents: myIntents
  });

  client.login(process.env.token);

  client.once('ready', () => {
    console.log('Ready!');
  });

  client.on('messageCreate', message => {
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

    const args = message.content.slice(process.env.prefix.length).split(/ +/);
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
      addIsRuning = true;
      message.channel.send('Next Command : !b nameBoss nameZone numZone');
    } else if (addIsRuning == true) {
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
          json[nextPosition].playerList[numPlayer].skillList[index].name = args[index + 3];
        }
        for (let index = 0; index < 4; index++) {
          json[nextPosition].playerList[numPlayer].skillList[index].toy = args[index + 7];
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
    } else if (command === 'get') {
      var nameBoss = args[0];
      var nameZone = args[1];
      var numZone = args[2];

      //si pas de zone et num ==> afficher liste apparition boss
      if (!nameBoss) {
        displayBossList(message);
      } else if (!nameZone || !numZone) {
        displayZoneListByBoss(message, nameBoss);
      } else { //sinon afficher setup
        displaySetup(message, nameBoss, nameZone, numZone);
      }
    }
  });

  function displayBossList(message) {
    message.channel.send('Boss list:');
    var responseText = "";
    json.forEach(element => {
      responseText += element.name + " \n";
    });
    message.channel.send(responseText);
  }

  function displayZoneListByBoss(message, nameBoss) {
    message.channel.send('Zone list for this Boss:');
    var responseText = "";
    json.forEach(element => {
      if (element.name == nameBoss) {
        console.log(element.name);
        responseText += element.name + " " + element.zone.name + " " + element.zone.num + " \n";
      }
    });
    message.channel.send(responseText);
  }

  function displaySetup(message, nameBoss, nameZone, numZone) {
    var responseText = "";
    message.channel.send('Display Setup:');
    var setupFound = json.find(element => (element.name == nameBoss && element.zone.name == nameZone && element.zone.num == numZone));
    responseText += setupFound.name + " " + setupFound.zone.name + " " + setupFound.zone.num + " \n";
    setupFound.playerList.forEach(player => {
      responseText += "**Player "+ player.type + ": **";
      player.skillList.forEach((skill,index) => {
        if(index !== 3){
          responseText += skill.name + " | ";
        }else{
          responseText += skill.name;
        }
      });
      responseText += "\n";
      responseText += "Pet: " + player.pet;
      responseText += "\n";
    }); 
    message.channel.send(responseText);
  }

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
    addIsRuning = false;
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