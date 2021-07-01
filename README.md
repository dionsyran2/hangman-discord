# Whats new in 1.4.1
* Removed a useless library that was installed

* Fixed bugs from 1.3.4 and 1.3.8
* Multiplayer Works
* In multiplayer the host (**The person who selects the word**) cannot play!
* In singleplayer only one person (The person who runs the start command) can play!


# in 1.3.9 - 1.4.0
Removing useless dependencies

# 1.3.8
* A lot of bug fixes, **BUT** multiplayer does not work!!!

# 1.3.7
* New reritten code for receiving messages
* Bugs such as **The user who puts the word at multiplayer can play** and **Every user can play in singleplayer** are going to be fixed tommorrow (V1.3.9) So please make sure to always run **npm i** when you start your discord bot

# 1.3.5
* I realised that if the bot was in multiple servers and a game was in some of them the bot would just go crazy
Its now fixed, Make sure to always update to the newest version!!!



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

Hangman.on("GameOver", (message) => {
    message.channel.send("No one found the word. To start another round please type !start")
})

Hangman.on("GameEnded", (message) => {
    message.channel.send("No one found the word, someone ended the game!")
})
```

**Send message to tell the user to select a gamemode**
**__This is required if you want the user to get asked to select gamemode else it will just time out as it will get no response!
```javascript
Hangman.on("select", (message) => {
    message.channel.send("Choose Gamemode: **singleplayer** or **multiplayer**")
})
```

**Other Events**
```javascript
//This will run when the stop function runs but there is no game on the server
Hangman.on("noGame", (message) => {
    message.reply("There is no game on this server, to start a game, type !start")
})

//this will run when the word is selected
Hangman.on("wordSet", (word) => {
    console.log(`Current word set to: ${word}`)
})

//This will run when 10 seconds have past and no gamemode has been selected
Hangman.on("selectModeTimeout", (message) => {
    message.reply("You didn't tell me if you want to play **singleplayer** or **multiplayer**!")
})
```


### Functions:

> start(client, message, discord)
This will start a game

>stop(client, message)
This will end a game, if there is one


### Events:

>selectModeTimeout (message)
This will fire when 10 seconds have past and no gamemode has been selected

>select (message)
This will get fired when you have to tell the user/member to select a gamemode

>wordFound (message)
This will get fired when someone found the word

>GameOver (message)
This will get fired when the hangman is fully drawn

>GameEnded (message)
This will get fired when someone ends the game (with the stop function)

>noGame (message)
This will get fired when the stop function runs but there is no game in the server

>wordSet (word)
This will get fired when the word is set





## Code Example:
```javascript
    const Hangman = require("hangman-discord")
const discord = require("discord.js")
const client = new discord.Client()

let config = {
    prefix: "!"
}
client.on("message", (message) => {
    if (message.mentions.users.first() === client.user) {

        message.channel.send("My prefix is " + config.prefix)

        return

    }
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;


    const args = message.content.slice(config.prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if (command == "start") {
        Hangman.start(client, message, discord)
    }
    if (command == "end") {
        Hangman.stop(client, message)
    }
})

client.on("ready", () => {
    console.log("Ready")

})

Hangman.on("selectModeTimeout", (message) => {
    message.reply("You didn't tell me if you want to play **singleplayer** or **multiplayer**!")
})
Hangman.on("select", (message) => {
    message.channel.send("Choose Gamemode: **singleplayer** or **multiplayer**")

})

Hangman.on("wordFound", (message) => {
    message.reply("Correct! To start another round please type !start")
})

Hangman.on("GameOver", (message) => {
    message.channel.send("No one found the word. To start another round please type !start")
})

Hangman.on("GameEnded", (message) => {
    message.channel.send("No one found the word, someone ended the game!")
})

Hangman.on("noGame", (message) => {
    message.reply("There is no game on this server, to start a game, type !start")
})
Hangman.on("wordSet", (word) => {
    console.log(`Current word set to: ${word}`)
})

client.login("Token Goes Here")
```
**Better Documentation and more functionality is comming soon!**