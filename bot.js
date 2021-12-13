const fs = require('fs');
const {
  Client,
  Intents
} = require('discord.js');

const {
  DBClient
} = require('pg');

const dbClient = new DBClient({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

dbClient.connect();

// const {
//   token,
//   prefix
// } = require('./config.json');

let json = require('./data/storage.json');

try {

  var nextPosition = json.length;

  var patternSetup = {
    bossName: "",
    zoneName: "",
    playerList: [{
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toy: ""
          }
        ],
        pet: ""
      },
      {
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toy: ""
          }
        ],
        pet: ""
      },
      {
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toy: ""
          }
        ],
        pet: ""
      },
      {
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toy: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toy: ""
          }
        ],
        pet: ""
      }
    ]
  };

  json[nextPosition] = patternSetup;
  var numPlayer = 0;
  var addIsRuning = 0;

  const myIntents = new Intents();

  myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

  const client = new Client({
    intents: myIntents
  });

  client.login(process.env.token);

  client.once('ready', () => {
    console.log('Ready to listen!');
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
      displayCurrentSetup(message, json[nextPosition]);
    } else if (command === 'add') {
      addIsRuning = true;
      message.channel.send('Next Command : !b nameBoss nameZone');
    } else if (addIsRuning == true) {
      if (command === 'b') {
        json[nextPosition].boss = args[0];
        json[nextPosition].zone = args[1];
        message.channel.send('Next Command : !p numPlayer className petName skill1 skill2 skill3 skill4 toy1 toy2 toy3 toy4');
      } else if (command === 'p') {
        numPlayer = parseInt(args[0]) - 1;
        json[nextPosition].playerList[numPlayer].class = args[1];
        json[nextPosition].playerList[numPlayer].pet = args[2];
        for (let index = 0; index < 4; index++) {
          json[nextPosition].playerList[numPlayer].skillList[index].name = args[index + 3];
        }
        for (let index = 0; index < 4; index++) {
          json[nextPosition].playerList[numPlayer].skillList[index].toy = args[index + 7];
        }
        if (isPlayerListFilledUp(json[nextPosition].playerList)) {
          message.channel.send('Your setup is finshed!');
          saveData(json);
        } else {
          message.channel.send('Next Command : !p numPlayer className petName skill1 skill2 skill3 skill4 toy1 toy2 toy3 toy4');
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
        displaySetup(message, nameBoss, nameZone);
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

  function displaySetup(message, nameBoss, nameZone) {
    var responseText = "";
    message.channel.send('Display Setup:');
    var setupFound = json.find(element => (element.name == nameBoss && element.zone.name == nameZone && element.zone.num == numZone));
    responseText += setupFound.name + " " + setupFound.zone.name + " " + setupFound.zone.num + " \n";
    setupFound.playerList.forEach(player => {
      responseText += "**Player " + player.class + ": **";
      player.skillList.forEach((skill, index) => {
        if (index !== 3) {
          responseText += skill.name + " | ";
        } else {
          responseText += skill.name;
        }
      });
      responseText += "\n";
      responseText += "Pet: " + player.pet;
      responseText += "\n";
    });
    message.channel.send(responseText);
  }

  function displayCurrentSetup(message, setup) {
    var responseText = "";
    message.channel.send('Display Current Setup:');
    responseText += setup.name + " " + setup.zone.name + " " + setup.zone.num + " \n";
    setup.playerList.forEach(player => {
      responseText += "**Player " + player.class + ": **";
      player.skillList.forEach((skill, index) => {
        if (index !== 3) {
          responseText += skill.name + " | ";
        } else {
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
    addIsRuning = false;
  }

  function saveData(setup) {
    // convert JSON object to string
    const data = JSON.stringify(setup);

    //parse data to DB
    //Skills
    //Players

    //Setup

    // write JSON string to a file
    // fs.writeFile('data/storage.json', data, (err) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log("JSON data is saved.");
    // });
  }

  function insertMultipleSkillsDB(skillName1, toyName1, skillName2, toyName2, skillName3, toyName3, skillName4, toyName4) {
    dbClient.query('INSERT INTO Skill VALUES (1,' + skillName1 + ',' + toyName1 + '),(2,' + skillName2 + ',' + toyName2 + '),(3,' + skillName3 + ',' + toyName3 + '),(4,' + skillName4 + ',' + toyName4 + ')', (err, res) => {
      if (err) throw err;
      var keys = Object.keys(res);
      dbClient.end();
    });
  }

} catch (error) {
  saveData(json);
  console.log(error);
}

