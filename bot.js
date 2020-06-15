const Discord = require("discord.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require("fs");
let config = require("./jsons/botconfig.json");
let token = config.token;
let prefix = config.prefix;
const registered = "./jsons/registrationdata.json";
const express = require("express");
const keepalive = require("express-glitch-keepalive");
const app = express();

app.use(keepalive);
app.get("/", (req, res) => {
  res.json("Бот запущен!");
});
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

fs.readdir("./cmds/", (err, files) => {
  if (err) console.log(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) console.log("no command to load");
  console.log(`loaded ${jsfiles.length} commands`);
  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`${i + 1}.${f} is loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", () => {
  console.log(`Bot Launched! ${bot.user.username}`);
  bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    console.log(link);
  });
});

bot.on("messageReactionAdd", (reaction, user) => {
  if (user.bot) return;
  fs.readFile(registered, "utf8", (err, data) => {
    var object = JSON.parse(data.toString());
    if (
      Object.getOwnPropertyNames(object).includes(reaction.message.channel.id)
    ) {
      let profiles = object[reaction.message.channel.id].registered;
      for (let i = 0; i < Object.keys(profiles).length; i++) {
        if (profiles[i].name == user.username) return;
      }
      let playerIndex = object[reaction.message.channel.id].values.index;
      let playerCount = object[reaction.message.channel.id].values.count;
      profiles[playerIndex] = {
        queue: 1,
        name: ""
      };
      profiles[playerIndex].name = user.username;
      profiles[playerIndex].queue = playerCount;
      object[reaction.message.channel.id].values.index++;
      object[reaction.message.channel.id].values.count++;
      fs.writeFileSync(registered, JSON.stringify(object));
    }
  });
});

bot.on("messageReactionRemove", (reaction, user) => {
  fs.readFile(registered, "utf8", (err, data) => {
    let object = JSON.parse(data.toString());
    for (
      let i = 0;
      i < Object.keys(object[reaction.message.channel.id].registered).length;
      i++
    ) {
      if (
        user.username == object[reaction.message.channel.id].registered[i].name
      ) {
        object[reaction.message.channel.id].values.index--;
        object[reaction.message.channel.id].values.count--;
        delete object[reaction.message.channel.id].registered[i];
        fs.writeFileSync(registered, JSON.stringify(object));
        for (
          let j = i + 1;
          j <=
          Object.keys(object[reaction.message.channel.id].registered).length;
          j++
        ) {
          object[reaction.message.channel.id].registered[i] = {
            queue: 0,
            name: ""
          };
          object[reaction.message.channel.id].registered[i].queue = i + 1;
          object[reaction.message.channel.id].registered[i].name = object[reaction.message.channel.id].registered[j].name;
          delete object[reaction.message.channel.id].registered[j];
          fs.writeFileSync(registered, JSON.stringify(object));
        }
      }
    }
  });
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  let user = message.author.username;
  let userid = message.author.id;
  let messageArray = message.content.split(" ");
  let command = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);
  if (!message.content.startsWith(prefix)) return;
  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) {
    console.log("RUN " + command);
    cmd.run(bot, message, args);
  }
});

bot.login(token);
