#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var Script = require( __dirname + '/../lib/script/script.js' );

Script.executeScript( Script.binPath + '/populate_resources.js' );
Script.executeScript( Script.binPath + '/set_platform.js' );

Script.setConfiguredTag();
