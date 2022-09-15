let mix = require( 'laravel-mix' );
const webpack = require('webpack');

class SimpleOutputPlugin {

    register(
        {
            colors = true,
        } = {}
    ) {
        this.ouputedText = '';
        this.outputed = false;

        this.colors = this.getColors(colors);
    }

    mapObj(obj, callback) {
        return Object.fromEntries(
            Object.entries(obj)
                .map(([key, value]) => [key, callback(value, key)])
        );
    }

    getColors(optionsColors) {
        let colors = {
            reset: 0,
            bold: 1,
            green: 32,
            bgBlue: 44,
            white: 37,
            red: 31,
            gray: '30;1',
        };

        if (optionsColors === false) {
            colors = this.mapObj(colors, () => null);
        } else if (optionsColors !== true) {
            Object.assign(colors, optionsColors);
        }

        return this.mapObj(colors, code => code !== null ? `\u001B[${code}m` : '');
    }

    printFinishText(text) {
        let {reset, gray} = this.colors,
            cleanTextSize = (this.ouputedText + text).replace(/\u001B\[.*?m/ig, '').length + 2,
            dotsSize = Math.max(Math.min(process.stdout.columns, 150) - cleanTextSize, 0),
            dots = (new Array(isNaN(dotsSize) ? 0 : dotsSize)).fill('.').join('');

        console.log(`${this.outputed ? "\n" + this.ouputedText : ''}${gray}${dots}${text}${reset}\n`);
        this.outputed = true;
    }

    webpackConfig(webpackConfig) {
        let {
            reset,
            bold,
            green,
            bgBlue,
            white,
            red,
        } = this.colors;

        webpackConfig.plugins = [
            ...webpackConfig.plugins
                .filter(
                    plugin => ![
                        // Disable progressbar
                        'WebpackBarPlugin',
                        // Disable finish output
                        'BuildOutputPlugin',
                    ].includes(plugin.constructor.name)
                ),
            {
                apply: (compiler) => {
                    compiler.hooks.done.tap('FinishSuccessSimpleOutputPlugin', stats => {
                        let {time, errorsCount} = stats.toJson({builtAt: true});
                        this.printFinishText(` ${time}ms ${bold}${errorsCount ? `${red}FAIL` : `${green}DONE`}`);
                    });
                    compiler.hooks.failed.tap('FinishErrorSimpleOutputPlugin', () => {
                        this.printFinishText(` ${bold}${red}FAIL`);
                    })
                }
            },
            new webpack.ProgressPlugin(() => {
                if (this.ouputedText) {
                    return;
                }

                process.stdout.write(this.ouputedText = `  ${bgBlue}${white} INFO ${reset} Compiling webpack assets `)
            }),
        ];

        return {
        };
    }
}

mix.extend('simpleOutput', new SimpleOutputPlugin());
