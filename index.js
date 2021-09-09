var emitter = require('events').EventEmitter;

let MessageAttachment = null

var em = new emitter();
const fetch = require("node-fetch")
var nodeHtmlToImage = require('node-html-to-image');
let imgs = ["https://i.imgur.com/mAWaxug.png", "https://i.imgur.com/l0fLASr.png", "https://i.imgur.com/c8uaMBQ.png", "https://i.imgur.com/pRng4Tl.png", "https://i.imgur.com/boDJ25n.png", "https://i.imgur.com/ArNimLI.png", "https://i.imgur.com/kkYj06y.png"]
let games = {}



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
        .then(json => word = json);
    word = word[0].word
    return word
}


module.exports = em


async function startMulti(client, message, discord) {
    let word = await getWord()
    let WordLetters = []
    let WordArray = []
    em.emit("wordSet", word)
    for (var i = 0; i < word.length; i++) {
        WordArray.push(word.charAt(i))
        if (i == 0) {
            WordLetters.push(word.charAt(i))
        } else if (i == word.length - 1) {
            WordLetters.push(word.charAt(i))
        } else {
            WordLetters.push("_")
        }
    }

    games[message.guild.id] = { game: 'multi', word: word, message: message, discord: discord, client: client, mistakes: [], wordLetters: WordLetters, wordArray: WordArray }
    let image = await getImage(imgs[games[message.guild.id].mistakes.length], games[message.guild.id].wordLetters.join(""), games[message.guild.id].mistakes.join(", "), message)
    games[message.guild.id].msg1 = await message.channel.send({ files: [new MessageAttachment(image, `img.jpeg`)] })

}


async function startSingle(client, message, discord) {
    let word = await getWord()
    let WordLetters = []
    let WordArray = []
    em.emit("wordSet", word)
    for (var i = 0; i < word.length; i++) {
        WordArray.push(word.charAt(i))
        if (i == 0) {
            WordLetters.push(word.charAt(i))
        } else if (i == word.length - 1) {
            WordLetters.push(word.charAt(i))
        } else {
            WordLetters.push("_")
        }
    }

    games[message.guild.id] = { game: 'single', word: word, message: message, discord: discord, client: client, mistakes: [], wordLetters: WordLetters, wordArray: WordArray }
    let image = await getImage(imgs[games[message.guild.id].mistakes.length], games[message.guild.id].wordLetters.join(""), games[message.guild.id].mistakes.join(", "), message)
    games[message.guild.id].msg1 = await message.channel.send({ files: [new MessageAttachment(image, `img.jpeg`)] })
}

function check(data) {
    if (data.mistakes.length == imgs.length - 1) {
        return 0
    } else if (data.word == data.wordLetters.join("")) {
        return 1
    } else {
        return 2
    }
}


async function receivedWordSingle(message2, discord) {
    message = message2.content.toLowerCase().split(" ")[0]
    let data = games[message2.guild.id]
    let Correct = false
    if (message == data.word.toLowerCase()) {

        Correct = true
        games[message2.guild.id].wordLetters = data.word.split('')
    } else {
        for (i = 0; i < data.wordArray.length; i++) {
            if (data.wordArray[i].toLowerCase() == message.toLowerCase()) {
                Correct = true
                games[message2.guild.id].wordLetters[i] = games[message2.guild.id].wordArray[i]
            }
        }
    }

    if (Correct == false) {
        if (!data.mistakes.find(m => m == message)) games[message2.guild.id].mistakes.push(message)
    }
    if (games[message2.guild.id].msg1) games[message2.guild.id].msg1.delete()
    console.log(data.wordLetters)
    console.log(data.wordLetters.join(""))
    let image = await getImage(imgs[games[message2.guild.id].mistakes.length], games[message2.guild.id].wordLetters.join(""), games[message2.guild.id].mistakes.join(", "), message2)
    games[message2.guild.id].msg1 = await message2.channel.send({ files: [new MessageAttachment(image, `img.jpeg`)] })



    let chk = await check(games[message2.guild.id])
    if (chk == 1) {
        em.emit("wordFound", message2)
        games[message2.guild.id] = null
    } else if (chk == 0) {
        em.emit("gameEndedSingle", message2)
        games[message2.guild.id] = null
    }
}









async function receivedWordMulti(message2, discord) {
    message = message2.content.toLowerCase().split(" ")[0]
    let data = games[message2.guild.id]
    let Correct = false
    if (message == data.word.toLowerCase()) {

        Correct = true
        games[message2.guild.id].wordLetters = data.word.split('')
    } else {
        for (i = 0; i < data.wordArray.length; i++) {
            if (data.wordArray[i].toLowerCase() == message.toLowerCase()) {
                Correct = true
                games[message2.guild.id].wordLetters[i] = games[message2.guild.id].wordArray[i]
            }
        }
    }

    if (Correct == false) {
        if (!data.mistakes.find(m => m == message)) games[message2.guild.id].mistakes.push(message)
    }
    if (games[message2.guild.id].msg1 != null) games[message2.guild.id].msg1.delete()
    console.log(data.wordLetters)
    console.log(data.wordLetters.join(""))
    let image = await getImage(imgs[games[message2.guild.id].mistakes.length], games[message2.guild.id].wordLetters.join(""), games[message2.guild.id].mistakes.join(", "), message2)
    games[message2.guild.id].msg1 = await message2.channel.send({ files: [new MessageAttachment(image, `img.jpeg`)] })



    let chk = await check(games[message2.guild.id])
    if (chk == 1) {
        em.emit("wordFound", message2)
        games[message2.guild.id] = null
    } else if (chk == 0) {
        em.emit("gameEndedMulti", message2)
        games[message2.guild.id] = null
    }
}





let initv = false

async function init(client, msg, discord) {
    initv = true
    MessageAttachment = discord.MessageAttachment
    client.on('messageCreate', (message) => {
        if (message.guild == null) return
        if (games[message.guild.id]) {
            if (games[message.guild.id].game == 'single') {
                if (games[message.guild.id].message.member.id == message.member.id && games[message.guild.id].message.channel.id == message.channel.id) {
                    receivedWordSingle(message, discord)
                    return
                }
            } else if (games[message.guild.id].game == 'multi') {
                if (message.author.bot == true) return
                if (games[message.guild.id].message.channel.id == message.channel.id) {
                    receivedWordMulti(message, discord)
                    return
                }
            }
        }
    })
}

module.exports.start = (client, message, discord) => {
    let args = []
    if (initv == false) init(client, message, discord)
    if (games[message.guild.id]) return em.emit("gameExists", message)
    if (args[0] == "singleplayer") {
        startSingle(client, message, discord)
        return
    } else if (args[0] == "multiplayer") {
        startMulti(client, message, discord)
    } else {
        em.emit("select", message)
        message.channel.awaitMessages({ filter: m => m.member.id == message.member.id & m.channel == message.channel & (m.content.toLowerCase() == 'multiplayer' || m.content.toLowerCase() == 'singleplayer' || m.content.toLowerCase() == 'multi' || m.content.toLowerCase() == 'single'), max: 1, time: 15000, errors: ['time'] })
            .then(async collected => {
                let message = collected.first()
                if (message.content.toLowerCase() == 'singleplayer' || message.content.toLowerCase() == 'single') {
                    startSingle(client, message, discord)
                } else {
                    startMulti(client, message, discord)
                }
            })
            .catch(err => {
                em.emit("selectTimeout", message)
            })
    }
}

module.exports.stop = (client, message) => {
    if (games[message.guild.id]){
        games[message.guild.id] = null
        em.emit("gameStop")
    }else{
        em.emit("noGame")
    }
}
