const Discord = module.require("discord.js");
const fs = require("fs");
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
const arr = [
  710378753708261408,
  710380241763303454,
  713297944509677599,
  714063706513735684,
  709791045604606062,
  713297652153843763,
  710378286202748931,
  710378791486357574
];
module.exports.run = async (bot, message, args) => {
  let memberrole = message.guild.members.cache.find(
    member => member.user.username == message.author.username
  )._roles;
  for (let i = 0; i < memberrole.length; i++) {
    for (let j = 0; j < roles.length; j++) {
      if (roles[j].id == memberrole[i]) {
        message.channel.send(roles[j].name);
      }
    }
  }
};

module.exports.help = {
  name: "unit"
};
