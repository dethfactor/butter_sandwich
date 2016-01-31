#!/usr/bin/env node

var Script = require( __dirname + '/../lib/script/script.js' );

Script.rmdirRecursive( Script.tmpBasePath );
//TODO: delete dl'd packages and stuff in /res/pkg


Script.unsetConfiguredTag();
Script.unsetCurrentArchTag();
Script.unsetCurrentPlatformTag();
