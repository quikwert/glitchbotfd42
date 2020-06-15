const Discord = module.require("discord.js");
const fs = require("fs");
const registered = "./jsons/registrationdata.json";
const roles = [
  { id: 710378753708261408, name: "1-отделение" },
  { id: 710380241763303454, name: "2-отделение" },
  { id: 713297944509677599, name: "3-отделение" },
  { id: 714063706513735684, name: "4-отделение" },
  { id: 710378791486357574, name: "Танкист" },
  { id: 709791045604606062, name: "Разведчик" },
  { id: 713297652153843763, name: "Инженер" },
  { id: 710378286202748931, name: "Восточник" }
];

module.exports.run = async (bot, message, args) => {
  fs.readFile(registered, "utf8", (err, data) => {
    let object = JSON.parse(data.toString());
    if (Object.getOwnPropertyNames(object).includes(message.channel.id)) {
      let messageToSend = "";
      let register = object[message.channel.id].registered;
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setTitle("Регистрация закончена")
          .setImage(
            "http://product.ligazakon.ua/wp-content/uploads/2015/12/end_but1.png"
          )
          .setTimestamp()
          .setFooter("Разработка ведется игроком D1M4")
      );
      for (let i = 0; i < Object.keys(register).length; i++) {
        messageToSend +=
          message.guild.members.cache.find(
            n => n.user.username === register[i].name
          ).displayName +
          " " +
          register[i].queue +
          ". в очереди " +
          checkRole(message.guild.members.cache, message) +
          "\n";
      }
      if (messageToSend == "") {
        messageToSend = new Discord.MessageEmbed()
          .setTitle("Никто не зарегистрировался")
          .setColor("#ff0000")
          .setFooter("Разработка ведется игроком D1M4");
      }
      message.author.send(messageToSend);
      message.channel.createInvite({ unique: true }).then(invite => {
        message.author.send(
          new Discord.MessageEmbed()
            .setTitle(
              "Регистрация закончена в канале: https://discord.gg/" +
                invite.code
            )
            .setColor("#00ff00")
            .setFooter("Разработка ведется игроком D1M4")
        );
      });
      messageToSend = "";
      delete object[message.channel.id];
      fs.writeFileSync(registered, JSON.stringify(object));
    } else {
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("#ff0000")
          .setTitle("Нет регистраций")
          .setTimestamp()
          .setFooter("Разработка ведется игроком D1M4")
      );
    }
  });
};

function checkRole(member, message) {
  let memberroles = member.find(
    member => member.user.username == message.author.username
  )._roles;
  for (let i = 0; i < memberroles.length; i++) {
    for (let j = 0; j < roles.length; j++) {
      if (roles[j].id == memberroles[i]) {
        return roles[j].name;
      }
    }
  }
  return "Нет отделения";
}
module.exports.help = {
  name: "end"
};
