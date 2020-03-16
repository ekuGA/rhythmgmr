class HelpCommandHandler {
    run(message, command_arguments = []) {
        let reply = "BOT COMMANDS: \n\n";

        reply += "\`$rg_sdvx [IMAGE/EMOTE/MENTION] \"[CUSTOM TEXT (optional)]\"\` = Turn an image into an SDVX track jacket\n";
        reply += "\`$rg_wacca [IMAGE/EMOTE/MENTION] \"[CUSTOM TEXT (optional)]\"\` = Turn an image into an WACCA scoreboard\n";
        reply += "\`$rg_help\` = ...This";

        message.channel.send(reply);
    }
}

module.exports = new HelpCommandHandler;