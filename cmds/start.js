const Discord = module.require("discord.js");
const fs = require("fs");
const registered = "./jsons/registrationdata.json";
module.exports.run = async (bot, message, args) => {
  if (
    message.guild.members.cache
      .find(name => name.user.username == message.author.username)
      ._roles.find(role => role == 712614388133003265) ||
    message.guild.members.cache
      .find(name => name.user.username == message.author.username)
      ._roles.find(role => role == 710045848180097034)
  ) {
    fs.readFile(registered, "utf8", (err, data) => {
      var object = JSON.parse(data.toString());
      if (Object.getOwnPropertyNames(object).includes(message.channel.id)) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Закончите предыдущую регистрацию")
            .setTimestamp()
            .setFooter("Разработка ведется игроком D1M4")
        );
        return;
      } else {
        message.channel
          .send(
            new Discord.MessageEmbed()
              .setColor("#00ff00")
              .setTitle("Регистрация началась")
              .setImage(
                "https://lh3.googleusercontent.com/proxy/hbW90BbHum-DPNVhI4PJVVWeIBLKVP1fS2vRl-47_5uG_migWhzc8Ff-ox9N-gGD4CcFGl5p2eJLrQrAHyOjYI5RqVk"
              )
              .setTimestamp()
              .setFooter("Разработка ведется игроком D1M4")
          )
          .then(function(message) {
            message.react("➕");
          });
        if (!object[message.channel.id]) {
          object[message.channel.id] = {
            values: {
              index: 0,
              count: 1
            },
            registered: {}
          };
          fs.writeFileSync(registered, JSON.stringify(object));
        }
      }
    });
  } else {
    console.log(
      message.guild.members.cache.find(member => member.nickname == "D1M4")
        .avatarURL
    );
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Роль не поддерживается")
        .addFields({
          name: "Поддерживаемые роли:",
          value: "Админ \n Клан Лидер"
        })
        .setTimestamp()
        .setFooter("Разработка ведется игроком D1M4")
    );
  }
};
module.exports.help = {
  name: "start"
};
