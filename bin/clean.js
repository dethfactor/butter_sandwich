#!/usr/bin/env node

var Script = require( __dirname + '/../lib/script/script.js' );

Script.rmdirRecursive( Script.tmpBasePath );
Script.rmdirRecursive( Script.pkgPath );
//TODO: delete dl'd packages and stuff in /res/pkg

Script.rm( Script.binPath + '/nw' );
Script.rm( Script.binPath + '/nwjc' );

Script.unsetConfiguredTag();
Script.unsetCurrentArchTag();
Script.unsetCurrentPlatformTag();
