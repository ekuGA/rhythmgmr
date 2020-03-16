const BaseHandler = require('./base-handler');

class WaccaCommandHandler extends BaseHandler {
    getArgumentData() {
        super.getArgumentData();

        let custom_text  = this.message.content.split(' "');
        this.custom_text = custom_text.length > 1 ? custom_text[1].slice(0, -1).toUpperCase() : 'FREEDOM DIVE';
    }

    processHandler() {
        return ({ filename, image }) => {
            let output_name = filename.split("\\");
            output_name     = output_name[output_name.length - 1];
            output_name     = output_name.split('.')[0];

            this.sharp(filename)
                .resize({
                    width  : 222,
                    height : 222,
                })
                .toFormat('png')
                .toBuffer()
                .then(this.createWaccaImage(output_name, filename))
                .catch(this.genericErrorCatch());
        };
    }

    createWaccaImage(output_name, filename) {
        return output_buffer => {
            this.sharp('./img/wacca_blank.png')
                .composite([
                    {
                        input : './img/wacca.png',
                        top   : 0,
                        left  : 0,
                    },
                    {
                        input : output_buffer,
                        top   : 195,
                        left  : 160,
                    },
                    {
                        input : this.customTextOverlay(),
                        top   : 428,
                        left  : 75,
                    },
                    {
                        input : this.userNameTextOverlay(),
                        top   : 120,
                        left  : 430,
                    },
                ])
                .toFile(`./img/output/${output_name}.png`)
                .then(() => this.sendImage(`./img/output/${output_name}.png`, filename))
                .catch(this.genericErrorCatch());
        }
    }

    // TODO: Add custom font-family
    customTextOverlay() {
        const textSVG = Buffer.from(`
            <svg width="300" height="20">
                <text x="50%" y="18" font-size="20" fill="#ff0082" text-anchor="middle">${this.custom_text}</text>
            </svg>
        `);

        return textSVG;
    }

    // TODO: Add custom font-family
    userNameTextOverlay() {
        const textSVG = Buffer.from(`
            <svg width="163" height="24">
                <text x="50%" y="18" font-size="20" fill="#FFF" text-anchor="middle">${this.author}</text>
            </svg>
        `);

        return textSVG;
    }
}

module.exports = new WaccaCommandHandler;