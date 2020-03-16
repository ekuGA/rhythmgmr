require('dotenv').config();

const Discord        = require('discord.js');
const client         = new Discord.Client();
const CommandFactory = require('./command-factory');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    try {
        CommandFactory.resolveCommand(message);
    } catch ($exception) {
        console.error($exception);
        message.channel.send(`Oops! Couldn't quite process that command!`);
    }
});

client.login(process.env.API_KEY);