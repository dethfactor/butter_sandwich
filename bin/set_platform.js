#!/usr/bin/env node

var os = require('os');
var path = require('path');
var Script = require( __dirname + '/../lib/script/script.js' );

// syntax: ./set_os.js <ARCHITECTURE> <OPERATING_SYSTEM>
var arch = process.argv[2] || Script.getCurrentArchTag() || os.arch();
var platform = process.argv[3] || Script.getCurrentPlatformTag() || os.platform();

console.log( 'Updating build target:\t\t' +
             'OS: ' + Script.getCurrentPlatformTag() + ' -> ' + platform + ', ' +
             'platform: ' + Script.getCurrentArchTag() + ' -> ' + arch );
Script.setCurrentArchTag( arch );
Script.setCurrentPlatformTag( platform );

//TODO: (re)create symlink for nw and nwjs binaries.
