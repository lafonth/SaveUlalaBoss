const fs = require('fs');
const {
  Client,
  Intents
} = require('discord.js');

const {
  Client: DBClient
} = require('pg');

const dbClient = new DBClient({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

dbClient.connect();
const config = (process.argv[2] == "dev") ? require('./config.json') : "";
const token = (process.argv[2] == "dev") ? config.token : process.env.token;
const prefix = (process.argv[2] == "dev") ? config.prefix : process.env.prefix;

let json = require('./data/storage.json');

try {

  var patternSetup = {
    bossName: "",
    zoneName: "",
    playerList: [{
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toyName: ""
          }
        ],
        pet: ""
      },
      {
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toyName: ""
          }
        ],
        pet: ""
      },
      {
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toyName: ""
          }
        ],
        pet: ""
      },
      {
        class: "",
        skillList: [{
            numOrder: 1,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 2,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 3,
            skillName: "",
            toyName: ""
          },
          {
            numOrder: 4,
            skillName: "",
            toyName: ""
          }
        ],
        pet: ""
      }
    ]
  };

  json = patternSetup;
  var numPlayer = 0;
  var addIsRuning = 0;

  const myIntents = new Intents();

  myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

  const client = new Client({
    intents: myIntents
  });

  client.login(token);

  client.once('ready', () => {
    console.log('Ready to listen!');
  });

  client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'clear') {
      reset();
      message.channel.send('Reset DONE!');
    } else if (command === 'save') {
      message.channel.send('Saving data...');
      saveData(json).then(function () {
        message.channel.send('Data SAVED!');
      });
      reset();
      message.channel.send('Setup saved!');
    } else if (command === 'init') {
      // createDB();
      // message.channel.send('DB created');
    } else if (command === 'test') {
      // insertMultipleSkillsDB("s1", "t1", "s2", "t2", "s3", "t3", "s4", "t4");
    } else if (command === 'check') {
      displayCurrentSetup(message, json);
    } else if (command === 'add') {
      addIsRuning = true;
      message.channel.send('Next Command : !b nameBoss nameZone');
    } else if (addIsRuning == true) {
      if (command === 'b') {
        json.boss = args[0];
        json.zone = args[1];
        message.channel.send('Next Command : !p numPlayer className petName skill1 skill2 skill3 skill4 toy1 toy2 toy3 toy4');
      } else if (command === 'p') {
        numPlayer = parseInt(args[0]) - 1;
        json.playerList[numPlayer].class = args[1];
        json.playerList[numPlayer].pet = args[2];
        for (let index = 0; index < 4; index++) {
          json.playerList[numPlayer].skillList[index].skillName = args[index + 3];
        }
        for (let index = 0; index < 4; index++) {
          json.playerList[numPlayer].skillList[index].toyName = args[index + 7];
        }
        if (isPlayerListFilledUp(json.playerList)) {
          message.channel.send('Your setup is finshed!');
          // saveData(json);
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

  function displaySetup(message, bossName, zoneName) {
    var responseText = "";
    message.channel.send('Display Setup:');
    json.playerList.forEach(player => {
      responseText += "**Player " + player.class + ": **";
      player.skillList.forEach((skill, index) => {
        if (index !== 3) {
          responseText += skill.skillName + " | ";
        } else {
          responseText += skill.skillName;
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
    responseText += setup.bossName + " " + setup.zoneName + " \n";
    setup.playerList.forEach(player => {
      responseText += "**Player " + player.class + ": **";
      player.skillList.forEach((skill, index) => {
        if (index !== 3) {
          responseText += skill.skillName + " | ";
        } else {
          responseText += skill.skillName;
        }
      });
      responseText += "\n";
      responseText += "Pet: " + player.pet;
      responseText += "\n";
    });
    message.channel.send(responseText);
  }

  function isExisting(elem){
    return (elem !== "" && typeof elem !== 'undefined');
  }

  function isSkillListFilledUp(skillList) {
    return skillList.every((skill) => {
      return isExisting(skill.skillName);
    });
  }

  function isPlayerListFilledUp(playerList) {
    return playerList.every((player) => {
      return (isSkillListFilledUp(player.skillList));
    });
  }

  function reset() {
    json = patternSetup;
    numPlayer = 0;
    addIsRuning = false;
  }

  async function saveData(setup) {
    console.log("saveData before loop: " + setup.playerList);
    for(const player in setup.playerList){
      console.log("saveData in loop: " + player.class);
      if (isExisting(player.class)) {
        await insertMultipleSkillsDB(
            player.skillList[0].skillName,
            player.skillList[0].toyName,
            player.skillList[1].skillName,
            player.skillList[1].toyName,
            player.skillList[2].skillName,
            player.skillList[2].toyName,
            player.skillList[3].skillName,
            player.skillList[3].toyName
          )
          .then(function (skills) {
            insertPlayer(player, skills);
          });
      }
    }
    Promise.resolve();
  }

  async function insertSetup(setup, playersData) {
    // dbClient.query('INSERT INTO Setup VALUE ()', (err, res) => {
    //   if (err) throw err;
    //   return keys = Object.keys(res);
    // });
  }

  async function insertPlayer(player, skills) {
    for(element of skills){
      console.log(element.skillid);
    }
    // dbClient.query('INSERT INTO Player VALUE ()', (err, res) => {
    //   if (err) throw err;
    //   return keys = Object.keys(res);
    // });
  }

  async function insertMultipleSkillsDB(skillName1, toyName1, skillName2, toyName2, skillName3, toyName3, skillName4, toyName4) {
    var query = "INSERT INTO Skill (numorder, skillName, toyname) VALUES (1,$1,$2),(2,$3,$4),(3,$5,$6),(4,$7,$8)"
    var params = [skillName1, toyName1, skillName2, toyName2, skillName3, toyName3, skillName4, toyName4];
    console.log("Before query");
    dbClient.query(query, params, (err, res) => {
      if (err) throw err;
      console.log("after query" +res);
      return keys = Object.keys(res);
    });
  }

  function createDB() {
    var query = `set transaction read write; 
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    
    
    CREATE TABLE IF NOT EXISTS Skill (
      skillId serial PRIMARY KEY,
      numOrder INTEGER NOT NULL,
      skillName VARCHAR ( 50 ) NOT NULL,
      toyName VARCHAR ( 50 ) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS Player (
      playerId serial PRIMARY KEY,
      class VARCHAR ( 50 ) NOT NULL,
      pet VARCHAR ( 50 ) NOT NULL,
      skillOne INTEGER REFERENCES skill (skillId),
      skillTwo INTEGER REFERENCES skill (skillId),
      skillThree INTEGER REFERENCES skill (skillId),
      skillFour INTEGER REFERENCES skill (skillId)
    );
    
    CREATE TABLE IF NOT EXISTS Setup (
      setupId serial PRIMARY KEY,
      bossName VARCHAR ( 50 ) NOT NULL,
      zoneName VARCHAR ( 50 ) NOT NULL,
      playerOne INTEGER REFERENCES player (playerId),
      playerTwo INTEGER REFERENCES player (playerId),
      playerThree INTEGER REFERENCES player (playerId),
      playerFour INTEGER REFERENCES player (playerId)
    ); 
    
    SELECT *
    FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog' AND 
        schemaname != 'information_schema';`;

    dbClient.query(query, (err, res) => {
      if (err) throw err;
    });
  }



} catch (error) {
  // saveData(json);
  console.log(error);
}