const http = require("http");
const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//////////////// BOT REAL ////////////////////////////

const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

client.once("ready", () => {
  console.log("BOT DINO PREPARADO!");
});

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const command = args.shift().toLowerCase();
  //const message = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong.");
  } else if (command === "foro") {
    message.channel.send(
      `Puedes visitar nuestro foro en el siguiente enlace: https://arenagames.pro/`
    );
  } else if (command === "torneo") {
    message.channel.send(
      `Hoy a partir de las 20:00/ 19:00 / 18:00(Argentina / Chile=Venezuela / Perú=Colombia)\nSe organizara el torneo SOLO/DUO en el servidor BattleRoyalLos registros para el torneo se harán dentro de la sección #💬pre-registro \nluego del Torneo habrá otro evento.`
    );
  } else if (command === "server") {
    message.channel.send(
      `Nombre Server: ${message.guild.name}\nTotal Usuarios: ${message.guild.memberCount}`
    );
  } else if (command === "infousuario") {
    message.channel.send(
      `Tu Usuario: ${message.author.username}\nTu ID: ${message.author.id}`
    );
  } else if (command === "info") {
    if (!args.length) {
      return message.channel.send(
        `No proporcionaste ningún argumento, ${message.author}!`
      );
    } else if (args[0] === "foo") {
      return message.channel.send("bar");
    }

    message.channel.send(`First argument: ${args[0]}`);
  } else if (command === "kick") {
    if (!message.mentions.users.size) {
      return message.reply("you need to tag a user in order to kick them!");
    }

    const taggedUser = message.mentions.users.first();

    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  } else if (command === "avatar") {
    if (!message.mentions.users.size) {
      return message.channel.send(
        `Your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`
      );
    }

    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: ${user.displayAvatarURL({
        dynamic: true
      })}`;
    });

    message.channel.send(avatarList);
  } else if (command === "spam") {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply("that doesn't seem to be a valid number.");
    } else if (amount <= 1 || amount > 100) {
      return message.reply("you need to input a number between 1 and 99.");
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send(
        "there was an error trying to prune messages in this channel!"
      );
    });
  }
});

client.on("message", message => {
  if (message.content === "d!frutas") {
    message
      .react("🍎")
      .then(() => message.react("🍊"))
      .then(() => message.react("🍇"))
      .catch(() => console.error("One of the emojis failed to react."));
  } else if (message.content === "d!votos") {
    message
      .react("🔴")
      .then(() => message.react("🔵"))
      .catch(() => console.error("One of the emojis failed to react."));
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
    }
  }
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
    }
  }
  console.log(
    `${user.username} removed their "${reaction.emoji.name}" reaction.`
  );
});

client.on("message", message => {
  if (message.content === "d!likes") {
    message.react("👍").then(() => message.react("👎"));

    const filter = (reaction, user) => {
      return (
        ["👍", "👎"].includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    message
      .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
      .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === "👍") {
          message.reply("reaccionaste con un pulgar hacia arriba.");
        } else {
          message.reply("reaccionaste con un pulgar hacia abajo.");
        }
      })
      .catch(collected => {
        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
        message.reply(
          "no reaccionaste ni con un pulgar hacia arriba ni un pulgar hacia abajo."
        );
      });
  }
});

client.login(token);
