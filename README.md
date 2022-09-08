# Laravel Mix Simple Output

[![Latest Version on NPM](https://img.shields.io/npm/v/laravel-mix-simple-output.svg?style=flat-square)](https://npmjs.com/package/laravel-mix-simple-output)
[![npm](https://img.shields.io/npm/dt/laravel-mix-simple-output.svg?style=flat-square)](https://www.npmjs.com/package/laravel-mix-simple-output)
[![Software License](https://img.shields.io/npm/l/laravel-mix-simple-output.svg?style=flat-square)](LICENSE)

This extension allows the disable default webpack mix progress bar and finish table, make your console and CI/CD output cleaner.
[Simple output](https://www.npmjs.com/package/laravel-mix-simple-output) package to Laravel Mix.

## Installation

Install the extension as a development dependency:

````
npm i -D laravel-mix-simple-output
````

## Usage

Require the extension and call the `simpleOutput` method.

````
const mix = require('laravel-mix');

require( 'laravel-mix-simple-output' );

mix.simpleOutput();
// or
mix.simpleOutput( {
	// enable colors - by default
	colors: true,
	// disable colors
	colors: false,
	// change colors (number in ansi)
	colors: {
		reset: 0,
        bold: 1,
        green: 32,
        bgBlue: 44,
        white: 37,
        red: 31,
        gray: '30;1',
	},
} );
````