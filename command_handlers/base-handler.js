class BaseHandler {
    constructor(sharp = require('sharp'), image_downloader = require('image-downloader'), fs = require('fs')) {
        this.sharp            = sharp;
        this.image_downloader = image_downloader;
        this.fs               = fs;
    }

    run(message, command_arguments = []) {
        this.has_attachment = message.attachments.keyArray().length > 0;

        if (!this.has_attachment && (!message || command_arguments.length < 2)) return;

        this.message           = message;
        this.author            = message.author.username.toUpperCase();
        this.command_arguments = command_arguments;

        this.getArgumentData();
        this.processImage();
    }

    getArgumentData() {
        if (this.message.attachments.keyArray().length > 0) {
            this.argument_image = this.getAttachmentImage();
        } else if (this.command_arguments[1].startsWith('<:') || this.command_arguments[1].startsWith('<a:')) {
            this.argument_image = this.getEmojiUrl();
        } else if (this.command_arguments[1].startsWith('<@!')) {
            this.argument_image = this.getProfilePicture();
        } else {
            this.argument_image = this.command_arguments[1] || '';
        }
    }

    processImage() {
        this.image_downloader.image({
            url  : this.argument_image,
            dest : './img/input',
        })
        .then(this.processHandler())
        .catch(this.genericErrorCatch());
    }

    processHandler() {
        return ({filename, image}) => {};
    }

    getEmojiUrl() {
        let emoji_id = this.command_arguments[1].split(':');
        emoji_id     = emoji_id[emoji_id.length - 1].split('>')[0];
        
        return `https://cdn.discordapp.com/emojis/${emoji_id}`;
    }

    getAttachmentImage() {
        return this.message
            .attachments
            .first()
            .url;
    }

    getProfilePicture() {
        return this.message
            .mentions
            .users
            .first()
            .avatarURL;
    }

    getAuthorProfilePicture() {
        return this.message
            .author
            .avatarURL;
    }

    sendImage(output_file = './img/sdvx.png', filename = '') {
        this.message.channel.send('Next Track!', {
          file : output_file,  
        })
        .then(() => {
            this.fs.unlink(output_file, () => {});
            this.fs.unlink(filename, () => {});
        })
        .catch(this.genericErrorCatch());
    }

    genericErrorCatch() {
        return error => {
            console.error(error);
            this.message.channel.send('Oops! Had trouble sending over the image!');
        }
    }
}

module.exports = BaseHandler;