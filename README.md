# Whats new in 1.4.3
* Upgraded from discord.js v12.5 to v13
* The entire package was rewritten

# 1.4.2
* Added github page [https://github.com/dionsyran2/hangman-discord](https://github.com/dionsyran2/hangman-discord/)
* For issues please go here [https://github.com/dionsyran2/hangman-discord/issues](https://github.com/dionsyran2/hangman-discord/issues)



# Table Of Contents
    1. How it works (How to use a bot with this module)
    2. Documentation
    3. Example bot code


# 1. How it works
## Singleplayer
* Run the command that starts the game, in my case its !start
* The module will ask you to choose mode, say singleplayer in the chat
* **__Please note that depending on your or your hosting provider's network speed the bot may be a bit slow__**

* After the bot sends the message you will be able to type letters or words! If you would like to know the game basics [click here](https://www.wikihow.com/Play-Hangman)

![Singleplayer](https://i.imgur.com/r2Rsjul.png)

## Multiplayer

* Run the command that starts the game, in my case its !start
* The module will ask you to choose mode, say multiplayer in the chat
* The bot will send you a Direct Message (DM) asking you to say a word

![Multiplayer](https://i.imgur.com/0rQ2JYj.png)

* After that all the other members will have to find the word!

# Documentation
**First you will have to require the module**

```javascript
const hangman = require("hangman-discord")
```


**Start a game**
```javascript
hangman.start(client, message, discord)
```

**End a game**
```javascript
hangman.stop(client, message)
```

**Send message every time the game ends or someone wins**
```javascript
Hangman.on("wordFound", (message) => {
    message.reply("Correct! To start another round please type !start")
})

Hangman.on("gameEnded", (message) => {
    message.channel.send("No one found the word")
})

Hangman.on("gameEndedSingle", (message) => {
    message.channel.send(`Sorry, <@${message.author.id}> You did not find the word!`)
})

Hangman.on("gameStop", (message) => {
    message.channel.send("The game was ended using !stop")
})

```

**Send message to tell the user to select a gamemode**
**__This is required if you want the user to get asked to select gamemode else it will just time out as it will get no response!__**
```javascript
Hangman.on("select", (message) => {
    message.channel.send("Choose Gamemode: **singleplayer** or **multiplayer**")
})
```

**Other Events**
```javascript
Hangman.on("gameExists", (message) => {
    message.channel.send("There is already a game running in this server!")
})

Hangman.on("wordSet", (word) => {
    console.log(`Current word set to: ${word}`)
})

Hangman.on("cannotDM", (message) => {
    message.reply("It looks like i cannot dm you :(")
})

Hangman.on("wordSelectTimeout", (message) => {
    message.member.send("Timeout")
})
```


### Functions:

> start(client, message, discord)
**This will start a game**

>stop(client, message)
**This will end a game, if there is one.**


### Events:

>selectTimeout (message)
**This will get called if no mode is selected within 15 seconds when using the `hangman.start(...)`.**

>select (message)
**This will get called when the `hangman.start(...)` runs.**

>wordFound (message)
**As its name says, this will get called once someone finds the word.**

>gameEnded (message)
**This gets called when the game ends, with no winner.**

>gameEndedSingle (message)
**The same as `gameEnded` but this is for singleplayer.**

>gameExists (message)
**This gets called when `hangman.start(...)` runs but there is already an active game in the server.**

>cannotDM (message)
**This gets called if the module cannot DM (Direct Message) a user.**

>gameStop (message)
**This gets called when `hangman.stop(...)` runs and there is an active game.**

>noGame(message)
**This gets called when `hangman.stop(...)` is called but there is no active game.**

>wordSet (word)
**This will get called when the word is set.**





## Code Example:
```javascript
const Hangman = require("hangman-discord")
const discord = require("discord.js")

const Intents = new discord.Intents([
    "GUILDS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    
]);

const client = new discord.Client({ intents: Intents })

let config = {
    prefix: "!"
}
client.on("messageCreate", (message) => {
    if (message.mentions.users.first() === client.user) {

        message.channel.send("My prefix is " + config.prefix)

        return

    }
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;


    const args = message.content.slice(config.prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if (command == "start") {
        Hangman.start(client, message, discord, args)
    }
    if (command == "end") {
        Hangman.stop(client, message)
    }
})

client.on("ready", () => {
    console.log("Ready")

})

Hangman.on("selectTimeout", (message) => {
    message.channel.send("Timeout!")
})
Hangman.on("select", (message) => {
    message.channel.send("Choose Gamemode: **singleplayer** or **multiplayer**")

})

Hangman.on("wordFound", (message) => {
    message.channel.send(`<@${message.author.id}> You found the word! To start another round please type !start`)
})


Hangman.on("gameEnded", (message) => {
    message.channel.send("No one found the word")
})

Hangman.on("gameEndedSingle", (message) => {
    message.channel.send(`Sorry, <@${message.author.id}> You did not find the word!`)
})

Hangman.on("wordSet", (word) => {
    //For Testing!!!!!!
    console.log(`Current word set to: ${word}`)
})

Hangman.on("gameExists", (message) => {
    message.channel.send("There is already a game running in this server!")
})

Hangman.on("cannotDM", (message) => {
    message.reply("It looks like i cannot dm you :(")
})

Hangman.on("wordSelectTimeout", (message) => {
    message.member.send("Timeout")
})

Hangman.on("gameStop", (message) => {
    message.channel.send("The game was ended using !stop")
})

Hangman.on("noGame", (message) => {
    message.member.send("There is no game active right now!")
})

client.login("Token Goes Here")
```
