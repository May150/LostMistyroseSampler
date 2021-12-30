require(`dotenv`).config();
const axios = require(`axios`);
const Discord = require(`discord.js`);

const prefix = "!"

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

let interval;

async function getMeme() {
  let response = await axios.get(`https://memeapi.pythonanywhere.com/`)
  return response.data.memes[0].url;
}

client.on(`ready`, () => {
  console.log(`logged in as ${client.user.tag}`)
})

client.on(`messageCreate`, async msg => {

  if (msg.author.bot) return;
  if (msg.content.indexOf(prefix) !== 0) return;

  const args = msg.content.slice(prefix.length).trim().split(/ /g);
  // args == [`rps`, `rock`]
  const command = args.shift().toLowerCase();
  // args == [`rock`], command == `rps`
  console.log(args, "/n", command);

  switch (command) {
    case "ping":
      msg.reply("Pong!");
      break;
    case "meme":
      msg.channel.send("Here's your meme!");
      const img = await getMeme();
      msg.channel.send(img);
      break;
    case "water":
      msg.channel.send("You are now subscribed. Have fun.");
      interval = setInterval(() => {
        msg.reply("Drink some water!!!")
          .catch(console.error);
      }, 6000);
      break;
    case "stop":
      msg.reply("I have stopped the reminders.");
      clearInterval(interval);
      break;
    case "d20":
      let result = Math.floor(Math.random() * 20 + 1);
      msg.reply(`You rolled a ${result}!`);
      break;
    case "rps":
      const acceptedReplies = ["rock", "paper", "scissors"];
      const random = Math.floor(Math.random() * acceptedReplies.length);
      const response = acceptedReplies[random];

      const choice = args[0];
      if (!choice) return msg.reply(`How to play: \`${prefix}rps <rock|paper|scissors>\``);
      if (!acceptedReplies.includes(choice)) {
        return msg.reply(`Only these responses are accepted: \`${acceptedReplies.join(`,`)} \``);
      }

      console.log(`Bot result: ${response}`);
      if (response === choice) {
        return msg.reply("Its a tie! 😭 We made the same choice.");
      }

      switch (choice) {
        case `rock`:
          if (result === `paper`) {
            return msg.reply(`I won!`);
          } else {
            return msg.reply(`You won`);
          }
          break;
        case `paper`:
          if (result === `scissors`) {
            return msg.reply(`I won!`);
          } else {
            return msg.reply(`You won!`)
          }
          break;
        case `scissors`:
          if (result === `rock`) {
            return msg.reply(`I won!`);
          } else {
            return msg.reply(`You won!`);
          }
          break;
        default: {
          return msg.reply("This should not happen");
          break;
        }

      }





  }
})

client.on("message reaction", reaction => {

})

client.login(process.env.CLIENT_TOKEN);