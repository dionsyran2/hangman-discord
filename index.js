let MultiOrSingleV = {}

var emitter = require('events').EventEmitter;

var em = new emitter();
const fetch = require("node-fetch")
var nodeHtmlToImage = require('node-html-to-image');
let imgs = ["https://i.imgur.com/mAWaxug.png", "https://i.imgur.com/l0fLASr.png", "https://i.imgur.com/c8uaMBQ.png", "https://i.imgur.com/pRng4Tl.png", "https://i.imgur.com/boDJ25n.png", "https://i.imgur.com/ArNimLI.png", "https://i.imgur.com/kkYj06y.png"]


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}



async function getImage(url, word2, mistakesString, message) {
    const _htmlTemplate = `<style>
    body {
      background-image: url('https://i.imgur.com/A9tDo4A.jpg');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: cover;
      background-size: 100% 100%;
    }
    </style>
    <img src="${url}" style="height:250px; width: 250px; position: relative; top: 80px; left: 25px;"/>
    <p><span style="color: #ffffff; position: absolute; top: 50%; font-size: 70px; left: 250px">${word2}</span></p>
    <p><span style="color: #ffffff; position: absolute; top: 70%; font-size: 70px; left: 250px">${mistakesString}</span></p>
    `
    const images = await nodeHtmlToImage({
        html: _htmlTemplate,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
            args: ['--no-sandbox'],
        },
        encoding: 'buffer',
    })


    
    return images
}

async function getWord() {
    let word
    await fetch('https://random-words-api.vercel.app/word')
        .then(res => res.json())
        .then(json =>word = json);
    word = word[0].word
    em.emit("wordSet", word)
    return word
}





async function getWordMulti(client, message, discord) {
    MultiOrSingleV[message.guild.id].waitingForWord = true
    let word = null
    message.author.send('Please type a word, you have **15 seconds**').catch(() => { message.reply("I was unable to DM you!"); MultiOrSingleV[message.guild.id] = null })
    client.on("message", (msg) => {
        if (MultiOrSingleV[message.guild.id] == null) return;
        if (msg.guild == null && msg.author.id == message.author.id && MultiOrSingleV[message.guild.id].waitingForWord == true) {
            wrd = msg.content.split(" ")[0]
            MultiOrSingleV[message.guild.id].waitingForWord = false
            word = wrd
        }
    })
    for (i = 0; i < 16; i++) {
        if (MultiOrSingleV[message.guild.id].waitingForWord == false) {
            break;
        } else {
            await sleep(1000)
        }
    }
    if (MultiOrSingleV[message.guild.id].waitingForWord == true) {
        MultiOrSingleV[message.guild.id] = null
        message.author.send("You did not reply in time!").catch(() => { console.log("Could not send message to user!") })
    }

    em.emit("wordSet", word)
    return word

}

async function StartMulti(client, message, discord){
    try{
    MultiOrSingleV[message.guild.id].word = await getWordMulti(client, message, discord)


    if (MultiOrSingleV[message.guild.id].word == null) {
        MultiOrSingleV[message.guild.id] = null
        return
    }
    //variables
    const MessageAttachment = discord.MessageAttachment

    MultiOrSingleV[message.guild.id].letters = []

    MultiOrSingleV[message.guild.id].WordLetters = []

    MultiOrSingleV[message.guild.id].mistakesString = ""

    //create the table with the characters
    for (var i = 0; i < MultiOrSingleV[message.guild.id].word.length; i++) {
        MultiOrSingleV[message.guild.id].letters.push(MultiOrSingleV[message.guild.id].word.charAt(i))
        if (i == 0) {
            MultiOrSingleV[message.guild.id].WordLetters.push(MultiOrSingleV[message.guild.id].word.charAt(i))
        } else if (i == MultiOrSingleV[message.guild.id].word.length - 1) {
            MultiOrSingleV[message.guild.id].WordLetters.push(MultiOrSingleV[message.guild.id].word.charAt(i))
        } else {
            MultiOrSingleV[message.guild.id].WordLetters.push("_")
        }
    }

    //creates the text to display to the users
    MultiOrSingleV[message.guild.id].word2 = ""
    for (var i = 0; i < MultiOrSingleV[message.guild.id].WordLetters.length; i++) {
        MultiOrSingleV[message.guild.id].word2 = MultiOrSingleV[message.guild.id].word2 + MultiOrSingleV[message.guild.id].WordLetters[i]
    }

    //creates the message to send
    //let imgs = ["https://i.imgur.com/mAWaxug.png", "https://i.imgur.com/l0fLASr.png", "https://i.imgur.com/c8uaMBQ.png", "https://i.imgur.com/pRng4Tl.png", "https://i.imgur.com/boDJ25n.png", "https://i.imgur.com/ArNimLI.png", "https://i.imgur.com/kkYj06y.png"]
    MultiOrSingleV[message.guild.id].mistakes = []
    let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]

    let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, "", message)

    MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))


    }catch{
        message.channel.send("An unknown error has occured!")
    }
}





async function StartSingle(client, message, discord) {
    try{
            //get the MultiOrSingleV[message.guild.id].word
    MultiOrSingleV[message.guild.id].word = await getWord()


    //variables
    const MessageAttachment = discord.MessageAttachment

    MultiOrSingleV[message.guild.id].letters = []

    MultiOrSingleV[message.guild.id].WordLetters = []
    MultiOrSingleV[message.guild.id].mistakesString = ""
    //create the table with the characters
    for (var i = 0; i < MultiOrSingleV[message.guild.id].word.length; i++) {
        MultiOrSingleV[message.guild.id].letters.push(MultiOrSingleV[message.guild.id].word.charAt(i))
        if (i == 0) {
            MultiOrSingleV[message.guild.id].WordLetters.push(MultiOrSingleV[message.guild.id].word.charAt(i))
        } else if (i == MultiOrSingleV[message.guild.id].word.length - 1) {
            MultiOrSingleV[message.guild.id].WordLetters.push(MultiOrSingleV[message.guild.id].word.charAt(i))
        } else {
            MultiOrSingleV[message.guild.id].WordLetters.push("_")
        }
    }

    //creates the text to display to the users
    MultiOrSingleV[message.guild.id].word2 = ""
    for (var i = 0; i < MultiOrSingleV[message.guild.id].WordLetters.length; i++) {
        MultiOrSingleV[message.guild.id].word2 = MultiOrSingleV[message.guild.id].word2 + MultiOrSingleV[message.guild.id].WordLetters[i]
    }

    //creates the message to send
    // = ["https://i.imgur.com/mAWaxug.png", "https://i.imgur.com/l0fLASr.png", "https://i.imgur.com/c8uaMBQ.png", "https://i.imgur.com/pRng4Tl.png", "https://i.imgur.com/boDJ25n.png", "https://i.imgur.com/ArNimLI.png", "https://i.imgur.com/kkYj06y.png"]
    MultiOrSingleV[message.guild.id].mistakes = []
    let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]

    let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, "", message)

    MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))

    }catch{
        message.channel.send("An unknown error has occured!")
    }




}

async function MultiOrSingle(client, message, discord) {
    //This will ask for the gamemode, i am too lazy to write more comments
    if (MultiOrSingleV[message.guild.id] == null) {
        MultiOrSingleV[message.guild.id] = {
            user: message.author.id
        }

        em.emit('select', message);
        MultiOrSingleV[message.guild.id].waiting = true
        client.on("message", (msg) => {
            if (MultiOrSingleV[message.guild.id] == null) {
                return;
            }
            if (msg.author.id == MultiOrSingleV[message.guild.id].user) {

                if (MultiOrSingleV[message.guild.id].isInGame == true || MultiOrSingleV[message.guild.id].waiting == false || MultiOrSingleV[message.guild.id].waiting == null) {
                    return;
                }



                msg = msg.content.toLowerCase()
                if (msg == "singleplayer") {
                    MultiOrSingleV[message.guild.id].mode = 0
                    MultiOrSingleV[message.guild.id].waiting = false

                    StartSingle(client, message, discord)
                } else if (msg == "multiplayer") {
                    MultiOrSingleV[message.guild.id].waiting = false
                    MultiOrSingleV[message.guild.id].mode = 1
                    StartMulti(client, message, discord)
                }
            }
        })

        await sleep(10000);
        if (MultiOrSingleV[message.guild.id].waiting == true) {
            em.emit('selectModeTimeout', message);
            MultiOrSingleV[message.guild.id] = null
        }
    } else {
        message.reply("There is already a game on this server!")
    }
}



let initV = false


//recive messages

async function init(client, discord){
    const MessageAttachment = discord.MessageAttachment

    client.on("message", async (message) => {
        let msg = message
        if (message == null) return;
        if (message.guild == null) return;
         if (MultiOrSingleV[message.guild.id] != null){
             if (MultiOrSingleV[message.guild.id].waiting == true) return;

            if(MultiOrSingleV[message.guild.id].mode == 0){
                //singleplayer

                if (msg.author.bot == false && message.author.id == MultiOrSingleV[message.guild.id].user) {
                    //checks if the message is more than one character
                    if (msg.content.length > 1) {
                        //checks if the message is the same as the MultiOrSingleV[message.guild.id].word
                        if(MultiOrSingleV[message.guild.id] == null) return;
                        if (MultiOrSingleV[message.guild.id].word == null) {
                            MultiOrSingleV[message.guild.id] = null
                            return
                        };
                        if (msg.content.toLowerCase() == MultiOrSingleV[message.guild.id].word.toLowerCase()) {
                            //creates the message
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }


                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word, MultiOrSingleV[message.guild.id].mistakesString)
                            
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
        
                            //fires the wordFound event
                            em.emit("wordFound", msg)
                            MultiOrSingleV[message.guild.id].word = null
                            MultiOrSingleV[message.guild.id] = null
                        } else {
                            //wrong
                            MultiOrSingleV[message.guild.id].mistakes.push(msg.content)
        
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, MultiOrSingleV[message.guild.id].mistakesString, message)
        
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }
        
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
        
                            if (MultiOrSingleV[message.guild.id].mistakes.length == 6) {
                                em.emit("GameOver", msg)
                                MultiOrSingleV[message.guild.id].word = null
                                MultiOrSingleV[message.guild.id] = null
        
                            }
                        }
                    } else {
                        //if the letter is found in the MultiOrSingleV[message.guild.id].word, then replace _ with the letter
                        let found = 0;
                        for (i = 0; i < MultiOrSingleV[message.guild.id].letters.length; i++) {
                            if (MultiOrSingleV[message.guild.id].letters[i].toLowerCase() == msg.content.toLowerCase()) {
                                MultiOrSingleV[message.guild.id].WordLetters[i] = MultiOrSingleV[message.guild.id].letters[i]
                                found++
                            }
                        }
        
        
                        //checks if there are any characters found
                        if (found > 0) {
                            // get the MultiOrSingleV[message.guild.id].word
                            MultiOrSingleV[message.guild.id].word2 = ""
                            for (var i = 0; i < MultiOrSingleV[message.guild.id].WordLetters.length; i++) {
                                MultiOrSingleV[message.guild.id].word2 = MultiOrSingleV[message.guild.id].word2 + MultiOrSingleV[message.guild.id].WordLetters[i]
                            }
        
                            //create the message
        
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
        
                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, MultiOrSingleV[message.guild.id].mistakesString, message)
        
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }
        
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
                            if (MultiOrSingleV[message.guild.id].word2 == MultiOrSingleV[message.guild.id].word) {
                                em.emit("wordFound", msg)
                                MultiOrSingleV[message.guild.id].word = null
                                MultiOrSingleV[message.guild.id] = null
                            }
                        } else {
                            //No letters found
                            MultiOrSingleV[message.guild.id].mistakes.push(msg.content)
        
        
        
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
        
                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, MultiOrSingleV[message.guild.id].mistakesString, message)
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }
        
        
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
        
                            if (MultiOrSingleV[message.guild.id].mistakes.length == 6) {
                                em.emit("GameOver", msg)
                                MultiOrSingleV[message.guild.id].word = null
                                MultiOrSingleV[message.guild.id] = null
                            }
                        }
                    }
        
                }
            }else{
                //multiplayer






               if (msg.author.bot == false && message.author.id != MultiOrSingleV[message.guild.id].user) {
                    //checks if the message is more than one character
                    if (msg.content.length > 1) {
                        //checks if the message is the same as the MultiOrSingleV[message.guild.id].word
                        if(MultiOrSingleV[message.guild.id] == null) return;
                        if (MultiOrSingleV[message.guild.id].word == null) {
                            MultiOrSingleV[message.guild.id] = null
                            return
                        };
                        if (msg.content.toLowerCase() == MultiOrSingleV[message.guild.id].word.toLowerCase()) {
                            //creates the message
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }


                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word, MultiOrSingleV[message.guild.id].mistakesString)
                            
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
        
                            //fires the wordFound event
                            em.emit("wordFound", msg)
                            MultiOrSingleV[message.guild.id].word = null
                            MultiOrSingleV[message.guild.id] = null
                        } else {
                            //wrong
                            MultiOrSingleV[message.guild.id].mistakes.push(msg.content)
        
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, MultiOrSingleV[message.guild.id].mistakesString, message)
        
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }
        
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
        
                            if (MultiOrSingleV[message.guild.id].mistakes.length == 6) {
                                em.emit("GameOver", msg)
                                MultiOrSingleV[message.guild.id].word = null
                                MultiOrSingleV[message.guild.id] = null
        
                            }
                        }
                    } else {
                        //if the letter is found in the MultiOrSingleV[message.guild.id].word, then replace _ with the letter
                        let found = 0;
                        for (i = 0; i < MultiOrSingleV[message.guild.id].letters.length; i++) {
                            if (MultiOrSingleV[message.guild.id].letters[i].toLowerCase() == msg.content.toLowerCase()) {
                                MultiOrSingleV[message.guild.id].WordLetters[i] = MultiOrSingleV[message.guild.id].letters[i]
                                found++
                            }
                        }
        
        
                        //checks if there are any characters found
                        if (found > 0) {
                            // get the MultiOrSingleV[message.guild.id].word
                            MultiOrSingleV[message.guild.id].word2 = ""
                            for (var i = 0; i < MultiOrSingleV[message.guild.id].WordLetters.length; i++) {
                                MultiOrSingleV[message.guild.id].word2 = MultiOrSingleV[message.guild.id].word2 + MultiOrSingleV[message.guild.id].WordLetters[i]
                            }
        
                            //create the message
        
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
        
                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, MultiOrSingleV[message.guild.id].mistakesString, message)
        
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }
        
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
                            if (MultiOrSingleV[message.guild.id].word2 == MultiOrSingleV[message.guild.id].word) {
                                em.emit("wordFound", msg)
                                MultiOrSingleV[message.guild.id].word = null
                                MultiOrSingleV[message.guild.id] = null
                            }
                        } else {
                            //No letters found
                            MultiOrSingleV[message.guild.id].mistakes.push(msg.content)
        
        
        
                            let url = imgs[MultiOrSingleV[message.guild.id].mistakes.length]
        
                            MultiOrSingleV[message.guild.id].mistakesString = ""
                            for (i = 0; i < MultiOrSingleV[message.guild.id].mistakes.length; i++) {
                                if (MultiOrSingleV[message.guild.id].mistakesString == "") {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakes[i]
                                } else {
                                    MultiOrSingleV[message.guild.id].mistakesString = MultiOrSingleV[message.guild.id].mistakesString + ", " + MultiOrSingleV[message.guild.id].mistakes[i]
                                }
                            }
        
        
                            let images = await getImage(url, MultiOrSingleV[message.guild.id].word2, MultiOrSingleV[message.guild.id].mistakesString, message)
                            if (MultiOrSingleV[message.guild.id].msg1 != null) {
                                MultiOrSingleV[message.guild.id].msg1.delete()
                                MultiOrSingleV[message.guild.id].msg1 = null
                            }
        
        
                            MultiOrSingleV[message.guild.id].msg1 = await message.channel.send(new MessageAttachment(images, `img.jpeg`))
        
                            if (MultiOrSingleV[message.guild.id].mistakes.length == 6) {
                                em.emit("GameOver", msg)
                                MultiOrSingleV[message.guild.id].word = null
                                MultiOrSingleV[message.guild.id] = null
                            }
                        }
                    }
        
                }
            }
        }
    })
}






module.exports = em

module.exports.start = (client, message, discord) => {
    if(initV == false){
        initV = true
        init(client, discord)
    }
    if (message.guild != null) {
        if (client == null || message == null || discord == null) {
            throw new TypeError("hangman-discord: at Function start, Missing parameters")
        } else {
            MultiOrSingle(client, message, discord)
        }
    } else {
        message.reply("You must run this command from a server!")
    }
}

module.exports.stop = (client, message) => {
    if (message.guild != null) {
        if (client == null || message == null) {
            throw new TypeError("hangman-discord: at Function stop, Missing parameters")
        } else {
            if (MultiOrSingleV[message.guild.id] != null && MultiOrSingleV[message.guild.id].waiting == false) {
                em.emit("GameEnded", message)
                MultiOrSingleV[message.guild.id] = null
            } else {
                em.emit("noGame", message)
            }
        }
    } else {
        message.reply("You must run this command from a server!")
    }

}