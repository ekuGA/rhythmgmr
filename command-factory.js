class CommandFactory {
    getCommandFromMap(command) {
        const COMMAND_MAP = {
            '$rg_help'  : require('./command_handlers/help-command-handler'),
            '$rg_puc'   : require('./command_handlers/puc-command-handler'),
            '$rg_sdvx'  : require('./command_handlers/sdvx-command-handler'),
            '$rg_wacca' : require('./command_handlers/wacca-command-handler'),
        };

        return COMMAND_MAP[command] || null;
    }

    resolveCommand(message) {
        const command = message.content;

        if (!command.startsWith('$rg_')) return;
        
        const command_arguments = command.split(' ');
        const command_prefix    = command_arguments[0];
        const command_handler   = this.getCommandFromMap(command_prefix);

        if (command_handler === null) return;
        else command_handler.run(message, command_arguments);
    }
}

module.exports = new CommandFactory;