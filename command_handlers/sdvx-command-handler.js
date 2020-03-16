const BaseHandler = require('./base-handler');

class SdvxCommandHandler extends BaseHandler {
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
                    width  : 383,
                    height : 383,
                })
                .toFormat('png')
                .toBuffer()
                .then(this.createSdvxImage(output_name, filename));
        };
    }

    createSdvxImage(output_name, filename) {
        return output_buffer => {
            this.sharp('./img/sdvx.png')
                .composite([
                    {
                        input : output_buffer,
                        top   : 167,
                        left  : 111,
                    },
                    {
                        input : this.customTextOverlay(),
                        top   : 616,
                        left  : 131,
                    },
                    {
                        input : this.userNameTextOverlay(),
                        top   : 656,
                        left  : 131,
                    },
                ])
                .toFile(`./img/output/${output_name}.png`)
                .then(() => this.sendImage(`./img/output/${output_name}.png`, filename))
                .catch(this.genericErrorCatch());
        }
    }

    customTextOverlay() {
        const textSVG = Buffer.from(`
            <svg width="343" height="30">
                <defs>
                    <style>
                        <![CDATA[
                            @import url('https://fonts.googleapis.com/css?family=Righteous&display=swap');
                        ]]>
                    </style> 
                </defs>
                <text x="50%" y="24" font-family="Righteous" font-size="30" fill="#FFF" text-anchor="middle">${this.custom_text}</text>
            </svg>
        `);

        return textSVG;
    }

    userNameTextOverlay() {
        const textSVG = Buffer.from(`
            <svg width="343" height="30">
                <text x="50%" y="24" font-size="25" fill="#FFF" text-anchor="middle">${this.author}</text>
            </svg>
        `);

        return textSVG;
    }
}

module.exports = new SdvxCommandHandler;